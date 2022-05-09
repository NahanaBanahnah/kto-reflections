import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined'

import { DateTime } from 'luxon'
import { Button } from '@mui/material'
import styles from './txns.module.scss'
import LinkIcon from '@mui/icons-material/Link'

const Txns = ({ obj, divisor }) => {
	const theme = useTheme()
	const matches = useMediaQuery(theme.breakpoints.up('sm'))

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
	console.log(NUMBER_CLASS.join(','))
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
		<>
			<div className={styles.date}>{DATE}</div>
			<div className={NUMBER_CLASS.join(' ')}>
				{ICON}
				{(obj.amount / divisor).toLocaleString()}
			</div>
			{matches && (
				<div>
					<Button
						startIcon={<LinkIcon />}
						size="small"
						variant="outlined"
						color="secondary"
						href={`https://etherscan.io/tx/${obj.hash}`}
						target="_blank"
					>
						Etherscan
					</Button>
				</div>
			)}
		</>
	)
}

export default Txns
