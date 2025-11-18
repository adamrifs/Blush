const express = require('express')
const { addAddress, getAddress } = require('../controllers/addressController')
const router = express.Router()

router.post('/addAddress', addAddress);
router.get('/getAddress/:id',getAddress)

module.exports = router