import multer from 'multer';
import { summarizeResume, SaveResponseAndPdfToDB , getSavedResumeAnalysis} from '../controllers/.js';

const router = express.Router();
const upload = multer();

router.post('/upload-to-get-summary', upload.single('pdf'), summarizeResume);  
router.post('/save-response', SaveResponseAndPdfToDB );
router.get('/get-saved-resume-analysis', getSavedResumeAnalysis );

export default router;
