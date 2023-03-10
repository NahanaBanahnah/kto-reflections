import Head from 'next/head'
import Image from 'next/image'

import React, { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import FavoriteIcon from '@mui/icons-material/Favorite'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import logo from '../public/img/storkLogo.svg'
import Txns from '../src/components/Txns/Txns'
import ViewSource from '../src/components/ViewSource/ViewSource'
import styles from '../styles/index.module.scss'
import {
	AppBar,
	Divider,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import { Box, Container, Stack } from '@mui/system'

const Index = () => {
	const DIVISOR = 1000000000

	const [address, setAddress] = useState(null)
	const [loading, setLoading] = useState(false)
	// const [error, setError] = useState(false)
	const [balance, setBalance] = useState(false)
	const [ins, setIns] = useState(false)
	const [outs, setOuts] = useState(false)
	const [reflections, setReflections] = useState(false)
	const [TXS, setTxs] = useState(null)

	const {
		handleSubmit,
		control,
		reset,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			wallet: '',
		},
	})

	const onSubmit = async ({ wallet }) => {
		// ========== reset states on submit
		setLoading(true)
		// setError(false)
		setBalance('')
		setReflections('')
		setTxs(null)

		// ========== pull the wallets total token balance
		const BALANCE = await axios.get('https://api.etherscan.io/api', {
			params: {
				module: 'account',
				action: 'tokenBalance',
				contractaddress: process.env.NEXT_PUBLIC_CONTRACT,
				address: wallet,
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
				address: wallet,
				apikey: process.env.NEXT_PUBLIC_API,
			},
		})

		//loop the transactions, add them up, and pull the data we want
		let total = 0
		let totalIn = 0
		let totalOut = 0
		let txs = []

		TXNS.data.result.forEach(e => {
			total =
				wallet.toLowerCase() === e.to
					? total + parseInt(e.value)
					: total - parseInt(e.value)

			let type = wallet.toLowerCase() === e.to ? 'in' : 'out'

			if (type === 'in') {
				totalIn = totalIn + parseInt(e.value)
			}
			if (type === 'out') {
				totalOut = totalOut + parseInt(e.value)
			}

			let obj = {
				timestamp: e.timeStamp,
				amount: e.value,
				hash: e.hash,
				type: type,
			}
			txs.push(obj)
		})

		// ========== final math and set all the states

		let balance = BALANCE.data.result / DIVISOR
		totalIn = totalIn / DIVISOR
		totalOut = totalOut / DIVISOR

		setTxs(txs.reverse())
		setIns(totalIn)
		setOuts(totalOut)
		setReflections(balance + totalOut - totalIn)
		setBalance(balance)
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

			<Box className="topBar" sx={{ padding: 4 }}>
				<Typography variant="body1">
					There is a currently a bug showing certain wallets a
					negative value. This is just a visual bug, you still have
					your reflections!
				</Typography>
			</Box>
			<Container fixed>
				<Stack mt={4} spacing={2}>
					<Box display="flex" justifyContent="center">
						<Image src={logo} alt="KTO" width={150} height={102} />
					</Box>

					<Typography
						variant="h3"
						component="h1"
						color="primary"
						textAlign="center"
					>
						KTO Reflections Viewer
					</Typography>
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
					<Controller
						name="wallet"
						rules={{
							required: 'Wallet Address Is Required',
							pattern: {
								value: /^0x[a-fA-F0-9]{40}$/g,
								message:
									'Please Enter A Valid ERC-20 Wallet Address',
							},
						}}
						control={control}
						render={({
							field: { onChange, ...field },
							fieldState: { error },
						}) => (
							<TextField
								{...field}
								required
								onChange={onChange}
								error={error}
								label={
									error
										? error.message
										: 'ERC-20 Wallet Address'
								}
								fullWidth
								color="white"
							/>
						)}
					/>
					<Box>
						<LoadingButton
							onClick={handleSubmit(onSubmit)}
							loading={false}
							color="primary"
							variant="contained"
							disableElevation
							disabled={Object.keys(errors).length !== 0}
						>
							View Reflections
						</LoadingButton>
					</Box>

					<Box>
						{loading && (
							<BorderLinearProgress color="white" height={10} />
						)}
						{/* {error && <h4>{error}</h4>} */}
					</Box>
					<Grid
						container
						spacing={2}
						display="flex"
						textAlign={{
							xs: 'center',
							sm: 'left',
						}}
					>
						<Grid item xs={12} sm={4}>
							Current Balance
						</Grid>
						<Grid
							item
							xs={12}
							sm={8}
							textAlign={{
								xs: 'center',
								sm: 'right',
							}}
						>
							{balance && balance.toLocaleString()}
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
							textAlign={{
								xs: 'center',
								sm: 'left',
							}}
						>
							Total Buys & Transfer Ins
						</Grid>
						<Grid
							item
							xs={12}
							sm={8}
							textAlign={{
								xs: 'center',
								sm: 'right',
							}}
						>
							{ins && ins.toLocaleString()}
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
							textAlign={{
								xs: 'center',
								sm: 'left',
							}}
						>
							Total Sells & Transfer Outs
						</Grid>
						<Grid
							item
							xs={12}
							sm={8}
							textAlign={{
								xs: 'center',
								sm: 'right',
							}}
						>
							{outs && outs.toLocaleString()}
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid
							item
							xs={12}
							sm={4}
							textAlign={{
								xs: 'center',
								sm: 'left',
							}}
						>
							Reflections
						</Grid>
						<Grid
							item
							xs={12}
							sm={8}
							textAlign={{
								xs: 'center',
								sm: 'right',
							}}
						>
							{reflections && reflections.toLocaleString()}
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
					</Grid>
					{TXS && (
						<Box>
							<Typography
								variant="h5"
								component="h2"
								color="primary"
								textAlign="center"
								mt={2}
							>
								Transaction History
							</Typography>

							<TableContainer>
								<Table
									sx={{ minWidth: 650 }}
									aria-label="simple table"
								>
									<TableHead>
										<TableRow>
											<TableCell>Date</TableCell>
											<TableCell>Token Amount</TableCell>
											<TableCell align="right">
												TXN
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{TXS &&
											TXS.map(e => (
												<Txns
													key={e.hash}
													obj={e}
													type={e.type}
													divisor={DIVISOR}
												/>
											))}
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					)}
				</Stack>
				<Box mb={4}>
					<br />
					<br />
				</Box>
			</Container>

			<footer className={styles.footer}>
				Made With <FavoriteIcon className={styles.heart} /> By Nahana
			</footer>
		</>
	)
}

export default Index
