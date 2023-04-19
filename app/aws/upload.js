const upload = async (req, res) => {
  try {
    // TODO: Complete code here

    return res
      .status(200)
      .json({
        fileCount: 0,
        largestFile: '',
        email: ''
      })
  } catch (err) {
    res.sendStatus(500)
  }
}

export default upload;
