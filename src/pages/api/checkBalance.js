import {
	getBalance,
	getTxnsAndReflections,
	getWalletAddress,
} from '@/common/utils/func'

/** Endpoint */

export default async function handler(req, res) {
	const { wallet, api } = req.query
	/** ===== needs an API Key and a wallet */
	if (!api) {
		return res.status(401).send({ error: 'Missing API Key' })
	}
	if (!wallet) {
		return res.status(400).send({ error: 'Missing Wallet Address' })
	}
	if (api !== process.env.NEXT_PUBLIC_THIS_API) {
		return res.status(401).send({ error: 'Unauthorized' })
	}
	/** ===== first check if its an ens name */
	const { data: address, error: ensError } = await getWalletAddress(wallet)
	if (ensError) {
		return res.status(400).send({ error: 'Invalid ENS' })
	}
	/** ===== get the balance */
	const { data: balance, error: balanceError } = await getBalance(address)
	if (balanceError) {
		return res.status(400).send({ error: 'Invalid Wallet' })
	}
	const { txns, totalIn, totalOut } = await getTxnsAndReflections(address)
	const reflections = balance + totalOut - totalIn
	return res.status(200).json({
		balance: balance,
		totalIn: totalIn,
		totalOut: totalOut,
		reflections: reflections,
	})
}
