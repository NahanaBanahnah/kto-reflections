import { Divider, Grid } from '@mui/material'
import React from 'react'

const IntRow = ({ label, int, price }) => {
	return (
		<>
			<Grid item xs={12} sm={4}>
				{label}
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				textAlign={{
					xs: 'center',
					sm: 'right',
				}}
			>
				{int && int.toLocaleString()}
			</Grid>
			<Grid item xs={12} sm={2} textAlign={{ xs: 'center', sm: 'right' }}>
				{price &&
					(price * int).toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					})}
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
		</>
	)
}

export default IntRow
