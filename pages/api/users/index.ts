import nc from 'next-connect';
import userService from '../../../backend/domains/user/service';
import handlerOptions from '../../../backend/middleware/handlerOptions';
import isAuth from '../../../backend/middleware/isAuth';
import jsend from '../../../backend/middleware/jsend';
import { AuthedExtendedNextApiRequest, ExtendedNextApiResponse } from '../../../backend/types/NextApi';

const handler = nc<AuthedExtendedNextApiRequest, ExtendedNextApiResponse>(handlerOptions)
  .use(jsend)
  .get(isAuth, async (req, res) => {
    const users = await userService.listUsers(req.context);

    return res.success({ data: users });
  })
  .post(async (req, res) => {
    const user = await userService.createUser(req.context, req.body);

    return res.success({ data: user, httpStatus: 201 });
  });

export default handler;
