const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/Post');

// Add comment to post
router.post('/:postId',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const newComment = {
                user: req.user.id,
                content: req.body.content
            };

            post.comments.unshift(newComment);
            await post.save();

            const populatedPost = await Post.findById(post._id)
                .populate('comments.user', 'username profilePicture');

            res.json(populatedPost.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Delete comment
router.delete('/:postId/:commentId',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const comment = post.comments.find(
                comment => comment._id.toString() === req.params.commentId
            );

            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            // Check user
            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            // Get remove index
            const removeIndex = post.comments
                .map(comment => comment._id.toString())
                .indexOf(req.params.commentId);

            post.comments.splice(removeIndex, 1);
            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Update comment
router.put('/:postId/:commentId',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);
            if (!post) {
                return res.status(404).json({ msg: 'Post not found' });
            }

            const comment = post.comments.find(
                comment => comment._id.toString() === req.params.commentId
            );

            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' });
            }

            // Check user
            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            comment.content = req.body.content;
            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
