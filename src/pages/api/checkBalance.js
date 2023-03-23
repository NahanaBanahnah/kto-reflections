export default function handler(req, res) {
	const { wallet, api } = req.query

	if (!wallet || !api) {
		return res.status(500).send({ error: 'failed to fetch data' })
	}

	return res.status(200).json({ name: 'John Doe' })
}
