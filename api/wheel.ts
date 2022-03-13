import axiosClient from '.';

const routeName = '/user';

const wheelAPI = {
    listItem: (tokenAxios?: any) => {
        const url = `${routeName}/list-rotation`;
        return axiosClient.get(url, {
            cancelToken: tokenAxios,
        });
    },
    getGift: (date: number, token: string, tokenAxios?: any) => {
        const url = `${routeName}/rotation-result?rotation_time=${date}`;
        return axiosClient.get(url, {
            cancelToken: tokenAxios,
            headers: {
                authorization: 'Bearer ' + token,
            },
        });
    },
    bet: (
        data: {
            rotation_code: string;
            rotation_time: number;
            bet_coin: number;
        },
        token: string,
        tokenAxios?: any
    ) => {
        const url = `${routeName}/save-bet-coin`;
        return axiosClient.post(url, data, {
            cancelToken: tokenAxios,
            headers: {
                authorization: 'Bearer ' + token,
            },
        });
    },
    history: (token: string, tokenAxios?: any) => {
        const url = `${routeName}/history-rotation`;
        return axiosClient.get(url, {
            cancelToken: tokenAxios,
            headers: {
                authorization: 'Bearer ' + token,
            },
        });
    },
};

export default wheelAPI;
