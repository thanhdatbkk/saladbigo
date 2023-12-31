import React, { memo } from 'react';
import Image from 'next/image';

import backgrounds from '../../../../constants/images/background';
import icons from '../../../../constants/images/icon';
import style from './WinPopup.module.scss';

/*===========> INTERFACE <==========*/
interface props {
    result?: any;
    onClose: any;
}

/*===========> MAIN COMPONENT <==========*/
function WinPopup({ result, onClose }: props) {
    return (
        <div>
            <div className={style.overlay} onClick={onClose}></div>
            <div className={style.main} onClick={onClose}>
                <div className={style.table}>
                    <div className={style.imgWin}>
                        <img src={result.rotation_result.image} alt="dish" />
                        {result.rotation_result.number > 0 && (
                            <span className={style.power}>
                                x{result.rotation_result.number}
                            </span>
                        )}
                    </div>
                    <div className={style.mainInfo}>
                        <div className={style.img}>
                            <img src={backgrounds.nice.src} alt="win" />
                        </div>
                        <div>
                            <h3>Rotation lucky đã chọn</h3>
                            <div>
                                <div className={style.row}>
                                    <span className={style.label}>
                                        {result?.list_bet_coin?.length > 0
                                            ? 'Bạn đã đặt:'
                                            : 'Bạn đã không đặt cược gì cả!'}
                                    </span>
                                    <div className={style.listBet}>
                                        {result?.list_bet_coin.map(
                                            (item: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className={style.item}
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={'bet-item'}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className={style.row}>
                                    <span className={style.label}>
                                        Chiến thắng:
                                    </span>
                                    <div className={style.coinNumber}>
                                        <span className={style.iconIcon}>
                                            <Image
                                                src={icons.coin}
                                                alt={'coin'}
                                                layout="fill"
                                            />
                                        </span>
                                        <span>{result?.coinWin}</span>
                                    </div>
                                </div>
                                <div className={style.row}>
                                    <span className={style.label}>
                                        Đã đặt cược:
                                    </span>
                                    <div className={style.coinNumber}>
                                        <span className={style.iconIcon}>
                                            <Image
                                                src={icons.coin}
                                                alt={'coin'}
                                                layout="fill"
                                            />
                                        </span>
                                        <span>{result?.coinBet}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(WinPopup);
