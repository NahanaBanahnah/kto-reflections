import { Divider, Grid } from '@mui/material'
import React from 'react'

const IntRow = ({ label, int }) => {
	return (
		<>
			<Grid item xs={12} sm={4}>
				{label}
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
				{int && int.toLocaleString()}
			</Grid>
			<Grid item xs={12}>
				<Divider />
			</Grid>
		</>
	)
}

export default IntRow
