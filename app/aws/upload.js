var AdmZip = require('adm-zip');
const upload = async (req, res) => {
  try {
    // TODO: Complete code here
    //Get the email and zipped file
    const { email } = req.body;
    const file = req.files[0].buffer;

    //Unzip the file
    const zip = new AdmZip(file);
    const zipEntries = zip.getEntries();
    
   
    //Get the number of files and largest file size
    let fileCount = 0;
    let largestFile = 0;
    for (const zipEntry of zipEntries) {
      //Don't count directories and hidden files
      if (!zipEntry.isDirectory && !zipEntry.name.startsWith('.')) {
        fileCount++;
        const fileSize = zipEntry.header.size;
        if (fileSize > largestFile) {
          largestFile = fileSize;
        }
      }
    }

    return res
      .status(200)
      .json({
        fileCount: fileCount,
        largestFile: `${largestFile} bytes`,
        email: email
      })
  } catch (err) {
    res.sendStatus(500)
  }
}

export default upload;
