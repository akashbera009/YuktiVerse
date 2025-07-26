// controllers/yearController.js
import Year from '../models/Year.js';
import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
// import Resource from '../models/Resource.js';
import Notebook from '../models/Notebook.js';
import HandwrittenNote from '../models/HandwrittenNote.js';

//               User → Year → Subject → Chapter ← [ Notebook, HandwrittenNote ]

export const createYear = async (req, res) => {
  const { title, important = false } = req.body;
  const userId = req.user._id;

  if (!title) {
    console.log('❌ Validation error: title is missing');
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const year = new Year({
      title,
      important,
      user: userId   
    });

    await year.validate();  // explicit check
    const saved = await year.save();

    console.log('✅ Year saved:', saved);
    return res.status(201).json(saved);

  } catch (err) {
    console.error('❗ Validation/Save Error:', err);
    return res.status(400).json({ error: err.message });
  }
};

export const listYears = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized: No user info found' });
    }
        // console.log(req.user ," ", req.user._id);

    const years = await Year.find({ user: req.user._id }).lean();

    if (!years || years.length === 0) {
      return res.status(404).json({ message: 'No years found for this user.' });
    }

    res.status(200).json(years);
  } catch (err) {
    console.error('❗ Error fetching years:', err.message || err);
    res.status(500).json({ error: 'Server error while fetching years' });
  }
};


export const addSubject = async (req, res) => {
  const { yearId } = req.params;
  const { name, important = false } = req.body;

  try {
    const subject = new Subject({
      name,
      important,
      year: yearId
    });

    const saved = await subject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listSubjects = async (req, res) => {
  const { yearId } = req.params;

  try {
    const subjects = await Subject.find({ year: yearId }).lean();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
export const addChapter = async (req, res) => {
  const { subjectId } = req.params;
  const { chapterTitle } = req.body;

  if (!chapterTitle) return res.status(400).json({ error: 'chapterTitle is required' });

  try {
    const chapter = new Chapter({ title: chapterTitle, subject: subjectId });
    const saved = await chapter.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
export const listChapters = async (req, res) => {
  const { subjectId } = req.params;

  try {
    const chapters = await Chapter.find({ subject: subjectId }).lean();
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 export const getMaterialsByChapter = async (req, res) => {
  const { chapterId } = req.params;

  try {
    const notebooks = await Notebook.find({ chapter: chapterId }).lean();
    const handwrittenNotes = await HandwrittenNote.find({ chapter: chapterId }).lean();

    res.status(200).json({
      notebooks,
      handwrittenNotes
    });
  } catch (err) {
    console.error('❌ Error fetching materials:', err);
    res.status(500).json({ error: 'Server error while fetching materials' });
  }
};

// export const addResource = async (req, res) => {
//   const { chapterId } = req.params;
//   const { kind, itemId } = req.body;

//   if (!kind || !itemId) {
//     return res.status(400).json({ error: 'kind and itemId are required' });
//   }

//   try {
//     const resource = new Resource({ kind, item: itemId, chapter: chapterId });
//     const saved = await resource.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

 
// export const listResources = async (req, res) => {
//   const { chapterId } = req.params;

//   try {
//     const resources = await Resource.find({ chapter: chapterId }).lean();
//     res.json(resources);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };



 
