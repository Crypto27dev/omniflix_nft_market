import React from "react";
import {Modal} from "./modal";
// @ts-ignore
import ReactDom from "react-dom";

export class CosmostationWCModal {
    open(uri: string, cb: any) {
        const wrapper = document.createElement("div");
        wrapper.setAttribute("id", "cosmostation-wc-QRModal");
        document.body.appendChild(wrapper);

        ReactDom.render(
            <Modal
                uri={uri}
                close={() => {
                    this.close();
                    cb();
                }}
            />,
            wrapper
        );
    }

    close() {
        const wrapper = document.getElementById("cosmostation-wc-QRModal");
        if (wrapper) {
            document.body.removeChild(wrapper);
        }
    }
}

export default CosmostationWCModal;
