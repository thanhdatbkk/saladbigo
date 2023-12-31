import Link from 'next/link';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../redux/reducers';
import Control from '../components/pages/wheel/Control';
import HeaederInfo from '../components/pages/wheel/HeaederInfo';
import InfoCoin from '../components/pages/wheel/InfoCoin';
import ItemWheel from '../components/pages/wheel/ItemWheel';
import NavBottom from '../components/pages/wheel/NavBottom';
import Timer from '../components/pages/wheel/Timer';
import WinPopup from '../components/pages/wheel/WinPopup';
import RequiredAuth from '../components/protected/RequiredAuth';
import style from '../styles/Home.module.scss';
import axiosClient from '../api';
import { setCoin, setUserData } from '../redux/actions/user';

function WheelPage() {
    const dispatch = useDispatch();
    const countDownId: any = useRef();

    const [currentItem, setCurrentItem] = useState<number>(0);
    const [isStarting, setIsStarting] = useState<boolean>(false);
    const [result, setResult] = useState<any>(null);
    const [listBet, setListBet] = useState<any>([]);

    const { listWheel } = useSelector((state: RootState) => state.wheel);
    const { userData } = useSelector((state: RootState) => state.user);
    /*---------- Effect active item ----------*/
    useEffect(() => {
        if (!isStarting) {
            let idTime = setInterval(() => {
                setCurrentItem((prev: number) => {
                    if (prev >= 7) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => {
                clearInterval(idTime);
            };
        }
    }, [isStarting]);

    useEffect(() => {
        if (!isStarting) {
            /********** Get list bet current **********/
            (async () => {
                try {
                    const res: any = await axiosClient.post<any>(
                        `${origin}/api/list-bet`,
                        {
                            date: userData.rotation_time,
                        }
                    );
                    setListBet(res.listBet.payload);
                } catch (e) {}
            })();
        } else {
            /********** clear list bet UI **********/
            setListBet([]);
        }
    }, [isStarting, userData.rotation_time]);

    /*---------- Start wheel ----------*/
    const handleStart = useCallback(async () => {
        if (!isStarting) {
            setIsStarting(true);
            countDownId.current = setInterval(() => {
                setCurrentItem((prev: number) => {
                    if (prev >= 7) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, 100);
            handleGetGift();
        }
    }, [isStarting]);

    const handleGetGift = useCallback(async () => {
        if (!isStarting) {
            const res: any = await axiosClient.post<any>(
                `${origin}/api/get-gift`,
                {
                    date: userData.rotation_time,
                }
            );
            const {
                rotation_time_next,
                rotation_result,
                list_bet_coin,
                coinWin,
                coin_user,
                coinBet,
            } = res?.result?.payload;

            if (!!rotation_result) {
                clearInterval(countDownId.current);
                dispatch(
                    setUserData({
                        ...userData,
                        rotation_time: rotation_time_next,
                    })
                );
                dispatch(setCoin(coin_user));
                /*===========> set result <==========*/
                setResult({ list_bet_coin, rotation_result, coinWin, coinBet });
                setIsStarting(false);
            } else {
                handleGetGift();
            }
        }
    }, [isStarting]);

    useEffect(() => () => clearInterval(countDownId.current), []);

    return (
        <RequiredAuth>
            <div className={style.container}>
                <HeaederInfo />
                <div className={style.mainWheel}>
                    {/********** Count down **********/}
                    <Timer onStart={handleStart} isStarting={isStarting} />
                    {/*********** End ***********/}
                    {/***********  List item ***********/}
                    <div className={style.listItem}>
                        {listWheel.map((item: any, index: number) => {
                            const itemBet: any = listBet.filter((bet: any) => {
                                return bet.rotation_code === item.rotation_code;
                            });
                            return (
                                <ItemWheel
                                    key={item.id}
                                    img={item.image}
                                    isStarting={isStarting}
                                    winTimes={item.rate}
                                    isActive={currentItem === index}
                                    data={item}
                                    coinBetCurrent={itemBet[0]?.bet_coin || 0}
                                />
                            );
                        })}
                    </div>
                    {/*********** End ***********/}
                </div>
                <Control />
                <InfoCoin />
                <Link href="/wheel/history">
                    <a className={style.linkHistory}>
                        Lịch sử
                        <span className={style.icon}>
                            <RiArrowRightSLine />
                        </span>
                    </a>
                </Link>
                <NavBottom />
                {result && (
                    <WinPopup result={result} onClose={() => setResult(null)} />
                )}
            </div>
        </RequiredAuth>
    );
}

export default memo(WheelPage);
