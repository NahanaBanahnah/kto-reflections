import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import Image from 'next/image'

import { styled } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'

import { Box, Container, Stack } from '@mui/system'

import {
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	TextField,
	Button,
	LinearProgress,
} from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import { IoIosHeart, IoIosInformationCircle } from 'react-icons/io'

import logo from '../../../../public/img/storkLogo.svg'
import Txns from '@/common/components/Txns/Txns'
import ViewSource from '@/common/components/ViewSource/ViewSource'
import {
	getBalance,
	getTxnsAndReflections,
	getWalletAddress,
} from '@/common/utils/func'

import styles from '@/styles/index.module.scss'
import TaxModal from '@/common/components/TaxModal/TaxModal'
import IntRow from '@/common/components/IntRow/IntRow'
import { useRouter } from 'next/router'

const Reflections = () => {
	const DIVISOR = 1000000000

	const [loading, setLoading] = useState(false)
	const [balance, setBalance] = useState(false)
	const [ins, setIns] = useState(false)
	const [outs, setOuts] = useState(false)
	const [reflections, setReflections] = useState(false)
	const [TXS, setTxs] = useState(null)
	const [open, setOpen] = useState(false)

	const ensReg =
		/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

	const {
		handleSubmit,
		control,
		setError,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			wallet: '',
		},
	})

	/**
	 * handle the routing
	 * index and [wid] are basically the same page
	 * so this component lives in both
	 */

	const router = useRouter()
	const { wid } = router.query

	useEffect(() => {
		if (wid) {
			setValue('wallet', wid)
		}
	}, [wid])

	const onSubmit = async ({ wallet }) => {
		setLoading(true)
		setBalance('')
		setReflections('')
		setTxs(null)

		/** ===== first lets check to see if they're using an ENS */
		const { data: address, error: ensError } = await getWalletAddress(
			wallet
		)
		if (ensError) {
			setLoading(false)
			setError('wallet', {
				message: 'ENS Name Not Found',
			})
			return false
		}

		const { data: balance, error: balanceError } = await getBalance(address)
		if (balanceError) {
			setLoading(false)
			setError('wallet', {
				message: 'Invalid Wallet Address',
			})
			return false
		}

		const { txns, totalIn, totalOut } = await getTxnsAndReflections(address)

		setTxs(txns.reverse())
		setIns(totalIn)
		setOuts(totalOut)
		setReflections(balance + totalOut - totalIn)
		setBalance(balance)
		setLoading(false)
		window.history.pushState(null, 'Page Title', `/wallet/${wallet}`)
	}

	// ========== styled loading bar
	const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
		height: 4,
		borderRadius: 10,
	}))

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	return (
		<>
			<Head>
				<title>KTO Reflections</title>
			</Head>

			<ViewSource />

			<TaxModal open={open} handleClose={handleClose} />

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
							<li>
								Please note this tool only works for Defi ETH
								wallets; and will not work for BitMart accounts.
							</li>
						</ol>
					</div>
					<Controller
						name="wallet"
						rules={{
							required: 'Wallet Address Is Required',
							pattern: {
								value: /^0x[a-fA-F0-9]{40}$/g | ensReg,
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
										: 'ERC-20 Wallet Address or ENS Name'
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
						>
							View Reflections
						</LoadingButton>
					</Box>

					<Box>
						{loading && (
							<BorderLinearProgress color="white" height={10} />
						)}
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
						<IntRow label="Current Balance" int={balance} />
						<IntRow label="Total Buys & Transfer Ins" int={ins} />
						<IntRow
							label="Total Sells & Transfer Outs"
							int={outs}
						/>
						<IntRow label="Reflections" int={reflections} />
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
											TXS.map(item => (
												<Txns
													key={item.hash}
													obj={item}
													type={item.type}
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
				Made With <IoIosHeart className={styles.heart} /> By Nahana
				<Button
					startIcon={<IoIosInformationCircle />}
					onClick={() => setOpen(true)}
					size={'small'}
					sx={{ marginLeft: 2 }}
				>
					More Info
				</Button>
			</footer>
		</>
	)
}

export default Reflections
