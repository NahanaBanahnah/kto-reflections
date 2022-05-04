import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import axios from 'axios'
import { DateTime } from 'luxon'

import ViewSource from '../src/components/ViewSource/ViewSource'

import styles from '../styles/index.module.scss'

const Index = () => {
	const [ADDRESS, setAddress] = useState('')
	const [LOADING, setLoading] = useState(false)
	const [ERROR, setError] = useState(false)
	const [TOTAL, setTotal] = useState('')
	const [TOTAL_PURCHASE, setPurchase] = useState('')
	const [REFLECTIONS, setReflections] = useState('')
	const [TXS, setTxs] = useState(null)

	const SUBMIT = async () => {
		setLoading(true)
		setError(false)
		setTotal('')
		setPurchase('')
		setReflections('')
		setTxs(null)

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

		if (BALANCE.data.status === '0') {
			setError(BALANCE.data.result)
			setLoading(false)
			return
		}

		const TXNS = await axios.get('https://api.etherscan.io/api', {
			params: {
				module: 'account',
				action: 'tokentx',
				contractaddress: process.env.NEXT_PUBLIC_CONTRACT,
				address: ADDRESS,
				apikey: process.env.NEXT_PUBLIC_API,
			},
		})

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

		setTxs(txs)

		total = total / 1000000000
		let purchase = BALANCE.data.result / 1000000000
		setPurchase(total)
		setReflections(purchase - total)
		setTotal(purchase)
		setLoading(false)
	}

	const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
		height: 4,
		borderRadius: 10,
	}))

	return (
		<>
			<ViewSource />
			<div className={styles.wrapper}>
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
						<Typography variant="h3" color="common.white">
							KTO Reflections Viewer
						</Typography>
						<TextField
							fullWidth
							label="Address"
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
								View
							</Button>
						</div>
						<div className={styles.loading}>
							{LOADING && (
								<BorderLinearProgress
									color="secondary"
									height={10}
								/>
							)}
							{ERROR && (
								<Typography variant="h5" color="common.white">
									{ERROR}
								</Typography>
							)}
						</div>
						<div className={styles.total}>
							{TOTAL && (
								<>
									<div>
										<Typography
											variant="body1"
											color="common.white"
										>
											Wallet Size:
										</Typography>
									</div>
									<div className={styles.number}>
										<Typography
											variant="body1"
											color="common.white"
										>
											{TOTAL.toLocaleString()}
										</Typography>
									</div>
								</>
							)}

							{TOTAL_PURCHASE && (
								<>
									<div>
										<Typography
											variant="body1"
											color="common.white"
										>
											Total Purchase:
										</Typography>
									</div>
									<div className={styles.number}>
										<Typography
											variant="body1"
											color="common.white"
										>
											{TOTAL_PURCHASE.toLocaleString()}
										</Typography>
									</div>
								</>
							)}

							{REFLECTIONS && (
								<>
									<div>
										<Typography
											variant="body1"
											color="common.white"
										>
											Reflections:
										</Typography>
									</div>
									<div className={styles.number}>
										<Typography
											variant="body1"
											color="common.white"
										>
											{REFLECTIONS.toLocaleString()}
										</Typography>
									</div>
								</>
							)}
						</div>
						<div className={styles.txns}>
							{TXS && (
								<>
									<div className={styles.header}>
										<Typography variant="body1">
											DATE
										</Typography>
									</div>
									<div className={styles.header}>
										<Typography variant="body1">
											TOKEN AMOUNT
										</Typography>
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
												<Typography
													variant="body1"
													color="common.white"
												>
													{myDateTime.toLocaleString(
														DateTime.DATETIME_SHORT
													)}
												</Typography>
											</div>
											<div>
												<Typography
													variant="body1"
													color="common.white"
												>
													{(
														e.amount / 1000000000
													).toLocaleString()}
												</Typography>
											</div>
										</>
									)
								})}
						</div>
					</div>
				</div>
				<Image
					src="/img/bg.png"
					quality={100}
					layout="fill"
					objectFit="cover"
					alt="background"
				/>
			</div>
		</>
	)
}

export default Index
