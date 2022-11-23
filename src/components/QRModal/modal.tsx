import React, {FunctionComponent, useEffect, useMemo, useState} from "react";
import {isAndroid, isMobile, saveMobileLinkInfo,} from "@walletconnect/browser-utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import QRCode from "qrcode.react";

export const Modal: FunctionComponent<{
    uri: string;
    close: () => void;
}> = ({uri, close}) => {
    const [checkMobile] = useState(() => isMobile());
    const [checkAndroid] = useState(() => isAndroid());

    const navigateToAppURL = useMemo(() => {
        if (checkMobile) {
            if (checkAndroid) {
                saveMobileLinkInfo({
                    name: "Cosmostation",
                    href: "intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;",
                });

                return `intent://wc?${uri}#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;`;
            } else {
                saveMobileLinkInfo({
                    name: "Cosmostation",
                    href: "cosmostation://wc",
                });

                return `cosmostation://wc?${uri}`;
            }
        }
    }, [checkAndroid, checkMobile, uri]);

    useEffect(() => {
        if (navigateToAppURL) {
            window.location.href = navigateToAppURL;
        }
    }, [navigateToAppURL]);

    return (
        <React.Fragment>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0,0,0,0.1)",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    close();
                }}
            >
                <div
                    style={{
                        padding: 20,
                        borderRadius: 15,
                        backgroundColor: "#eeeeee",
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    {!checkMobile ? (
                        <React.Fragment>
                            <h3
                                style={{
                                    fontSize: 20,
                                    margin: 0,
                                    marginBottom: 10,
                                }}
                            >
                                Scan QR Code
                            </h3>
                            <div>
                                <QRCode size={300} value={uri}/>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <h3
                                style={{
                                    fontSize: 20,
                                    margin: 0,
                                    marginBottom: 10,
                                }}
                            >
                                Open App
                            </h3>
                            <div>
                                <button
                                    onClick={() => {
                                        if (navigateToAppURL) {
                                            window.location.href = navigateToAppURL;
                                        }
                                    }}
                                >
                                    Open App
                                </button>
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};
