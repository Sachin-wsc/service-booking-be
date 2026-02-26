import attachmentRepository from "../repository/attachmentRepository.js";

const uploadProof = async (req, res) => {
  try {
    const { booking_id } = req.body;

    const id = await attachmentRepository.create({
      booking_id,
      image_path: req.file.filename
    });

    res.json({ message: "Proof uploaded successfully", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingAttachments = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const files = await attachmentRepository.findByBooking(booking_id);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { uploadProof, getBookingAttachments };