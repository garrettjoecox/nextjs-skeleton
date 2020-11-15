import nc from 'next-connect';
import userService from '../../../backend/domains/user/service';
import handlerOptions from '../../../backend/middleware/handlerOptions';
import isAuth from '../../../backend/middleware/isAuth';
import jsend from '../../../backend/middleware/jsend';
import { AuthedExtendedNextApiRequest, ExtendedNextApiResponse } from '../../../backend/types/NextApi';

const handler = nc<AuthedExtendedNextApiRequest, ExtendedNextApiResponse>(handlerOptions)
  .use(jsend)
  .get(isAuth, async (req, res) => {
    const {
      query: { userId },
    } = req;

    const user = await userService.getUser(req.context, userId as string);

    return res.success({ data: user });
  })
  .put(isAuth, async (req, res) => {
    const {
      query: { userId },
    } = req;
    const user = await userService.updateUser(req.context, userId as string, req.body);

    return res.success({ data: user, httpStatus: 201 });
  })
  .delete(isAuth, async (req, res) => {
    const {
      query: { userId },
    } = req;
    await userService.deleteUser(req.context, userId as string);

    return res.success();
  });

export default handler;
