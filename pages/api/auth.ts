import nc from 'next-connect';
import authService from '../../backend/domains/auth/service';
import { createAuthToken, setAuthCookie } from '../../backend/domains/auth/utils';
import handlerOptions from '../../backend/middleware/handlerOptions';
import isAuth from '../../backend/middleware/isAuth';
import jsend from '../../backend/middleware/jsend';
import { AuthedExtendedNextApiRequest, ExtendedNextApiResponse } from '../../backend/types/NextApi';

const handler = nc<AuthedExtendedNextApiRequest, ExtendedNextApiResponse>(handlerOptions)
  .use(jsend)
  .get(isAuth, async (req, res) => {
    const user = await authService.getAuthenticated(req.context);

    return res.success({ data: user });
  })
  .post(async (req, res) => {
    const user = await authService.login(req.context, req.body);
    const authToken = createAuthToken(user);

    setAuthCookie(req, res, authToken);

    return res.success({
      data: {
        user,
        token: authToken,
      },
    });
  })
  .delete(isAuth, async (req, res) => {
    setAuthCookie(req, res);

    return res.success();
  });

export default handler;
