import reviewRepository from "../repository/reviewRepository.js";

const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;

    const id = await reviewRepository.create({
      booking_id,
      user_id: req.user.id,
      rating,
      comment
    });

    res.json({ message: "Review submitted", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceReviews = async (req, res) => {
  try {
    const { service_id } = req.params;
    const reviews = await reviewRepository.findByService(service_id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { createReview, getServiceReviews };