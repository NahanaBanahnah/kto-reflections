import axios from 'axios'
import { CloudflareProvider } from 'ethers'

const divisor = 1000000000

/**
 * @param {*} wallet
 * @returns Address or Address from ENS
 */
export const getWalletAddress = async wallet => {
	const provider = new CloudflareProvider()

	let address = wallet

	const ensReg =
		/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
	const ensTest = wallet.match(ensReg)

	if (ensTest) {
		const ensAddress = await provider.resolveName(wallet)

		if (!ensAddress) {
			return { error: 'Invalid ENS Name' }
		}
		address = ensAddress
	}

	return { data: address }
}

/**
 *
 * @param {*} wallet
 * @returns KTO balance, or error
 */
export const getBalance = async wallet => {
	const balance = await axios.get('https://api.etherscan.io/api', {
		params: {
			module: 'account',
			action: 'tokenBalance',
			contractaddress: process.env.NEXT_PUBLIC_CONTRACT,
			address: wallet,
			tag: 'latest',
			apiKey: process.env.NEXT_PUBLIC_API,
		},
	})

	/** ======= if we get 0 the address is incorrect and theres no need to continue */
	if (balance.data.status === '0') {
		return {
			error: 'Invalid Address',
		}
	}

	return {
		data: balance.data.result / divisor,
	}
}

export const getTxnsAndReflections = async wallet => {
	let totalIn = 0
	let totalOut = 0
	let txnArray = []

	/** pull accounts from Etherscan */
	const txns = await axios.get('https://api.etherscan.io/api', {
		params: {
			module: 'account',
			action: 'tokentx',
			contractaddress: process.env.NEXT_PUBLIC_CONTRACT,
			address: wallet,
			apikey: process.env.NEXT_PUBLIC_API,
		},
	})

	/** loop each txn to pull the info we need */
	txns.data.result.forEach(item => {
		let type = wallet.toLowerCase() === item.to ? 'in' : 'out'
		let amount = parseInt(item.value)

		let obj = {
			timestamp: item.timeStamp,
			amount: amount,
			hash: item.hash,
			type: type,
		}

		/** On out swaps Etherscan only shows the amount of KTO the user received
		 *  and the KTO that went to the "marketing" wallet ... the KTO to gets reflected to users is missing
		 *  to fix this we have to jump through some hoops
		 *
		 *  FIRST :: luckily this shows as two events, but same txn
		 *  we can see if the txn hash is already in our txn array
		 */

		let filterIndex = txnArray.findIndex(row => row.hash === item.hash)

		/** We've matched a double txn .. lets go */
		if (filterIndex > 0) {
			/** we want to grab the received portion
			 * this will be greater than the tax portion .. so grab that record
			 */
			if (txnArray[filterIndex].amount < amount) {
				/** Historically, sell tax has always been 10%; but in different ratios
				 *  we want to figure out what number the received amount is 90% of
				 *  100 - 10 = 90 meaning they received 90% of their original swap amount
				 *  backwards math to get that number
				 */

				let original = (amount * 100) / 90

				/**
				 * the amount reflected to the community is ::
				 * Original swap amount - the marketing - amount they received
				 */
				let reflectTax =
					original - txnArray[filterIndex].amount - amount

				/** insert shia labeouf magic meme here  */
				let txObject = {
					...obj,
					amount: reflectTax,
					missingTax: true,
					original: original,
				}
				txnArray.push(txObject)
			}
		}

		txnArray.push(obj)
	})

	/** loop all the txns, plus any added for missing reflected tax */

	txnArray.forEach(item => {
		if (item.type === 'in') {
			totalIn = totalIn + item.amount
		}
		if (item.type === 'out') {
			totalOut = totalOut + item.amount
		}
	})

	return {
		txns: txnArray,
		totalIn: totalIn / divisor,
		totalOut: totalOut / divisor,
	}
}
