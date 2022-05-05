import { DateTime } from 'luxon'
import { Button } from '@mui/material'
import styles from './txns.module.scss'
import LinkIcon from '@mui/icons-material/Link'

const Txns = ({ obj, divisor }) => {
	const myDateTime = DateTime.fromSeconds(parseInt(obj.timestamp))
	return (
		<>
			<div>
				{myDateTime.toLocaleString({
					month: 'short',
					day: '2-digit',
					year: '2-digit',
				})}
			</div>
			<div className={styles.number}>
				{(obj.amount / divisor).toLocaleString()}
			</div>
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
		</>
	)
}

export default Txns
