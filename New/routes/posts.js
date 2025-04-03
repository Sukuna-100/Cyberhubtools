const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');

// Multer configuration for blog images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blog-images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type - only JPEG, JPG, PNG and GIF allowed'));
    }
});

// Get all posts with pagination and filters
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, search } = req.query;
        const query = {};

        if (category) query.category = category;
        if (tag) query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Post.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Increment view count
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

// Create post
router.post('/',
    passport.authenticate('jwt', { session: false }),
    upload.single('featuredImage'),
    async (req, res) => {
        try {
            const { title, content, category, tags } = req.body;
            const newPost = new Post({
                title,
                content,
                category,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                author: req.user.id,
                featuredImage: req.file ? req.file.filename : undefined
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Update post
router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            // Check user
            if (post.author.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            const { title, content, category, tags, status } = req.body;
            if (title) post.title = title;
            if (content) post.content = content;
            if (category) post.category = category;
            if (tags) post.tags = tags.split(',').map(tag => tag.trim());
            if (status) post.status = status;

            await post.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found' });
            }
            res.status(500).send('Server error');
        }
    }
);

// Delete post
router.delete('/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            // Check user
            if (post.author.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            await post.remove();
            res.json({ msg: 'Post removed' });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found' });
            }
            res.status(500).send('Server error');
        }
    }
);

// Like/unlike post
router.put('/like/:id',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            // Check if already liked
            const liked = post.likes.includes(req.user.id);
            if (liked) {
                post.likes = post.likes.filter(like => like.toString() !== req.user.id);
            } else {
                post.likes.unshift(req.user.id);
            }

            await post.save();
            res.json(post.likes);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
