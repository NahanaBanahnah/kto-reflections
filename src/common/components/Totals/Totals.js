import React from 'react'
import styles from './totals.module.scss'

const Totals = ({ label, amount, tooltip }) => {
	return (
		<>
			<div>{label}</div>
			<div className={styles.numbers}>{amount.toLocaleString()}</div>
			<div className={styles.tooltip}>{tooltip}</div>
		</>
	)
}

export default Totals
