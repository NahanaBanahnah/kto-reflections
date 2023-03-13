import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined'
import HelpIcon from '@mui/icons-material/Help'

import { DateTime } from 'luxon'
import {
	Button,
	IconButton,
	Modal,
	Popover,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material'
import styles from './txns.module.scss'
import LinkIcon from '@mui/icons-material/Link'
import { useRef, useState } from 'react'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close'

const Txns = ({ obj, divisor }) => {
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.up('md'))
	const [modalView, setModal] = useState(false)
	const popRef = useRef(null)

	const NUMBER_CLASS = [styles.number]
	const ICON =
		obj.type === 'in' ? (
			<AddCircleOutlinedIcon
				fontSize="12px"
				sx={{ marginRight: '4px' }}
			/>
		) : (
			<RemoveCircleOutlinedIcon
				fontSize="12px"
				sx={{ marginRight: '4px' }}
			/>
		)

	if (obj.type === 'out') {
		NUMBER_CLASS.push(styles.out)
	}

	const handleOpen = () => {
		setModal(true)
	}
	const handleClose = () => {
		setModal(false)
	}

	const myDateTime = DateTime.fromSeconds(parseInt(obj.timestamp))
	const DATE = matches
		? myDateTime.toLocaleString({
				month: 'short',
				day: '2-digit',
				year: '2-digit',
		  })
		: myDateTime.toLocaleString({
				month: '2-digit',
				day: '2-digit',
				year: '2-digit',
		  })
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: `60vw`,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	}
	return (
		<TableRow ref={popRef}>
			<TableCell>{DATE}</TableCell>
			<TableCell className={NUMBER_CLASS.join(' ')}>
				{ICON}
				{(obj.amount / divisor).toLocaleString()}
				{obj.missingTax && (
					<>
						<IconButton onClick={handleOpen}>
							<HelpIcon color="error" />
						</IconButton>
						<Modal open={modalView} onClose={handleClose}>
							<Box sx={style}>
								<IconButton
									sx={{ position: 'absolute', right: '32px' }}
									onClick={handleClose}
								>
									<CloseIcon />
								</IconButton>
								<Typography
									id="modal-modal-title"
									variant="h6"
									component="h2"
								>
									What's This?
								</Typography>
								<Typography
									id="modal-modal-description"
									sx={{ mt: 2 }}
								>
									When you swap KTO, Etherscan only lists 2 of
									the 3 amounts; the amount of KTO you swapped
									out minus tax & the tax to the marketing
									wallet. The remaining tax portion, which is
									distributed to holders as reflections, is
									not shown in the Etherscan txn; that is what
									this amount is (based on a 10% sell tax)
								</Typography>
							</Box>
						</Modal>
					</>
				)}
			</TableCell>

			<TableCell align="right">
				<Button
					startIcon={<LinkIcon />}
					size="small"
					variant="outlined"
					color="white"
					href={`https://etherscan.io/tx/${obj.hash}`}
					target="_blank"
				>
					Etherscan
				</Button>
			</TableCell>
		</TableRow>
	)
}

export default Txns
