import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import FavoriteIcon from '@mui/icons-material/Favorite'

import axios from 'axios'
import { DateTime } from 'luxon'

import Totals from '../src/components/Totals/Totals'
import ViewSource from '../src/components/ViewSource/ViewSource'
import styles from '../styles/index.module.scss'

const Index = () => {
	const DIVISOR = 1000000000

	const [ADDRESS, setAddress] = useState('')
	const [LOADING, setLoading] = useState(false)
	const [ERROR, setError] = useState(false)
	const [TOTAL, setTotal] = useState('')
	const [TOTAL_PURCHASE, setPurchase] = useState('')
	const [REFLECTIONS, setReflections] = useState('')
	const [TXS, setTxs] = useState(null)

	const SUBMIT = async () => {
		// ========== reset states on submit
		setLoading(true)
		setError(false)
		setTotal('')
		setPurchase('')
		setReflections('')
		setTxs(null)

		// ========== pull the wallets total token balance
		const BALANCE = await axios.get('https://api.etherscan.io/api', {
			params: {
				module: 'account',
				action: 'tokenBalance',
				contractaddress: process.env.NEXT_PUBLIC_CONTRACT,
				address: ADDRESS,
				tag: 'latest',
				apiKey: process.env.NEXT_PUBLIC_API,
			},
		})

		// ========== if we get 0 the address is incorrect and theres no need to continue
		if (BALANCE.data.status === '0') {
			setError(BALANCE.data.result)
			setLoading(false)
			return
		}

		// ========== get all the transactions
		const TXNS = await axios.get('https://api.etherscan.io/api', {
			params: {
				module: 'account',
				action: 'tokentx',
				contractaddress: process.env.NEXT_PUBLIC_CONTRACT,
				address: ADDRESS,
				apikey: process.env.NEXT_PUBLIC_API,
			},
		})

		//loop the transactions, add them up, and pull the data we want
		let total = 0
		let txs = []

		TXNS.data.result.forEach(e => {
			total = total + parseInt(e.value)
			let obj = {
				timestamp: e.timeStamp,
				amount: e.value,
			}
			txs.push(obj)
		})

		// ========== final math and set all the states
		total = total / DIVISOR
		let purchase = BALANCE.data.result / DIVISOR

		setTxs(txs)
		setPurchase(total)
		setReflections(purchase - total)
		setTotal(purchase)
		setLoading(false)
	}

	// ========== styled loading bar
	const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
		height: 4,
		borderRadius: 10,
	}))

	return (
		<>
			<Head>
				<title>KTO Reflections</title>
			</Head>
			<ViewSource />
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.logo}>
						<Image
							src="/img/logo.png"
							width="958"
							height="217"
							alt="logo"
						/>
					</div>
					<h1>KTO Reflections Viewer</h1>
					<div>
						<ol>
							<li>Enter your wallet address below</li>
							<li>Click View Reflections</li>
							<li>
								Information is pulled from Etherscan and is not
								stored or saved.
							</li>
						</ol>
					</div>
					<TextField
						fullWidth
						label="Your Wallet Address"
						id="address"
						placeholder="0x123456..."
						color="primary"
						className={styles.input}
						value={ADDRESS}
						onChange={e => setAddress(e.target.value)}
					/>
					<div className={styles.button}>
						<Button
							variant="contained"
							className={styles.button}
							onClick={() => SUBMIT()}
						>
							View Reflections
						</Button>
					</div>
					<div className={styles.loading}>
						{LOADING && (
							<BorderLinearProgress
								color="secondary"
								height={10}
							/>
						)}
						{ERROR && <h4>{ERROR}</h4>}
					</div>
					<div className={styles.total}>
						{TOTAL && (
							<Totals
								label="Wallet Size"
								amount={TOTAL}
								tooltip="Current number of KTO tokens in this wallet"
							/>
						)}

						{TOTAL_PURCHASE && (
							<Totals
								label="Total Purchase"
								amount={TOTAL_PURCHASE}
								tooltip="Total number of purchased KTO in this wallet"
							/>
						)}

						{REFLECTIONS && (
							<Totals
								label="Reflections"
								amount={REFLECTIONS}
								tooltip="Total amount of KTO tokens received from Reflections"
							/>
						)}
					</div>
					{TXS && <h2>Transaction History</h2>}
					<div className={styles.txns}>
						{TXS && (
							<>
								<div className={styles.header}>DATE</div>
								<div className={styles.header}>
									TOKEN AMOUNT
								</div>
							</>
						)}
						{TXS &&
							TXS.map(e => {
								const myDateTime = DateTime.fromSeconds(
									parseInt(e.timestamp)
								)
								return (
									<>
										<div>
											{myDateTime.toLocaleString(
												DateTime.DATETIME_SHORT
											)}
										</div>
										<div>
											{(
												e.amount / DIVISOR
											).toLocaleString()}
										</div>
									</>
								)
							})}
					</div>
				</div>
			</div>
			<div className={styles.imageBG}>
				<Image
					src="/img/bg.png"
					quality={100}
					layout="fill"
					objectFit="cover"
					alt="background"
				/>
			</div>
			<footer className={styles.footer}>
				Made With <FavoriteIcon className={styles.heart} /> By Nahana
			</footer>
		</>
	)
}

export default Index
