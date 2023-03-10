import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined'

import { DateTime } from 'luxon'
import { Button, TableCell, TableRow } from '@mui/material'
import styles from './txns.module.scss'
import LinkIcon from '@mui/icons-material/Link'

const Txns = ({ obj, divisor }) => {
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.up('md'))

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
	return (
		<TableRow>
			<TableCell>{DATE}</TableCell>
			<TableCell className={NUMBER_CLASS.join(' ')}>
				{ICON}
				{(obj.amount / divisor).toLocaleString()}
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
