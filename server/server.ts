import dotenv from 'dotenv';
import express from 'express';
import asyncHandler from 'express-async-handler';
import morgan from 'morgan';

import { initDb } from './datastore';
import { singInHandler, singUpHandler } from './handlers/authHandler';
import {
  createCommentHandler,
  deleteCommentHandler,
  listComments,
} from './handlers/commentHandler';
import { createLikeHandler, deleteLikeHandler } from './handlers/likeHandler';
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  listPostsHandler,
} from './handlers/postHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errorHandler } from './middleware/errorMiddleware';

(async () => {
  await initDb();
  dotenv.config();

  const PORT = process.env.PORT || 3000;

  const app = express();

  app.use(express.json());

  app.use(morgan('tiny'));

  // Public endpoints
  app.get('/v1/healthz', (req, res) => res.send({ status: 'OK ✌️' }));
  app.post('/v1/signup', asyncHandler(singUpHandler));
  app.post('/v1/signin', asyncHandler(singInHandler));
  app.get('/v1/posts', asyncHandler(listPostsHandler));
  app.get('/v1/posts/:id', asyncHandler(getPostHandler));
  app.get('/v1/comments/:postId', asyncHandler(listComments));

  app.use(authMiddleware);

  // Protedcted endpoints
  app.post('/v1/posts', asyncHandler(createPostHandler));
  app.delete('/v1/posts/:id', asyncHandler(deletePostHandler));
  app.post('/v1/comment', asyncHandler(createCommentHandler));
  app.delete('/v1/comments/:id', asyncHandler(deleteCommentHandler));
  app.post('/v1/likes/:postId', asyncHandler(createLikeHandler));
  app.delete('/v1/likes/:postId', asyncHandler(deleteLikeHandler));

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`);
  });
})();
