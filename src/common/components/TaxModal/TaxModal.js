import { IconButton, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { IoMdClose } from 'react-icons/io'

const TaxModal = ({ open, handleClose }) => {
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
		<Modal open={open} onClose={handleClose}>
			<Box sx={style}>
				<IconButton
					sx={{ position: 'absolute', right: '32px' }}
					onClick={handleClose}
				>
					<IoMdClose />
				</IconButton>

				<Typography variant="h6" component="h2">
					ABOUT
				</Typography>
				<Typography sx={{ mt: 2 }}>
					This tool is for informational purposes only, and should not
					be viewed as financial advice, or suggestions.
				</Typography>
				<Typography sx={{ mt: 2 }}>
					This was created to help calculate your received
					reflections. While it should be accurate, the most accurate
					way to calculate reflections is to keep your own historical
					data of purchase and swap amounts.
				</Typography>
				<Typography sx={{ mt: 2 }}>
					Blockchain data is pulled from Etherscan and is not stored
					to any internal or external databases or sources.
				</Typography>
				<Typography sx={{ mt: 2 }}>
					Price data is pulled from Coingecko when you click "View
					Reflections", and is rounded for easier viewing. Actual
					prices and totals may differ slightly.
				</Typography>
				<Typography sx={{ mt: 2 }}>
					This tool is created as a community project, and is not
					officially part of Kounotori Token.
				</Typography>
				<Typography sx={{ mt: 2 }}>
					Cookies are used to analyze website traffic and optimize
					your website experience.
				</Typography>
			</Box>
		</Modal>
	)
}

export default TaxModal
