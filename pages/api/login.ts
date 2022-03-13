import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import authAPI from '../../api/auth';
import wheelAPI from '../../api/wheel';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const body = req.body;
    const listItemWheel: any = await wheelAPI.listItem();
    authAPI
        .login(body)
        .then((data: any) => {
            if (data.code === 0) {
                res.setHeader('Set-Cookie', [
                    serialize('access-token', data.payload.token, {
                        path: '/',
                        httpOnly: true,
                    }),
                ]);
            }
            return res
                .status(200)
                .json({ ...data, listItemWheel: listItemWheel });
        })
        .catch((err) => {
            return res.status(500);
        });
}
