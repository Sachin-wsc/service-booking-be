import invoiceRepository from "../repository/invoiceRepository.js";

const markInvoicePaid = async (req, res) => {
  try {
    const { booking_id } = req.body;
    await invoiceRepository.markPaid(booking_id);
    res.json({ message: "Invoice marked as paid" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoice = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const invoice = await invoiceRepository.findByBooking(booking_id);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { markInvoicePaid, getInvoice };