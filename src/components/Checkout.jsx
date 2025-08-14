import { useContext, useActionState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../utils/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + (item.quantity * item.price), 0);

    const { data, error, sendRequest, clearData } = useHttp("https://localhost:3000/orders", requestConfig);



    function handleCloseCheckout() {
        userProgressCtx.hideCheckout();
    }

    async function checkOutAction(prevState, formData) {
        const customerData = Object.fromEntries(formData.entries());

        await sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData,
            },
        }))

    }

    function handleFinish() {
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    const [formState, formAction, isLoading] = useActionState(checkOutAction, null)

    let actions = (
        <>
            <Button type="button" textOnly onClick={handleCloseCheckout}>Close</Button>
            <Button>Submit Order</Button>
        </>
    );

    if (isLoading) {
        actions = <span>Sending order data....</span>
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCheckout}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will bet back to you with more details via email within the next few minutes</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal >;
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={userProgressCtx.progress === 'checkout' ? handleCloseCheckout : null}>
        <form action={formAction}>
            <h2>Checkout</h2>
            <p>Total Amount:{currencyFormatter.format(cartTotal)}</p>
            <Input label="Full Name" type="text" id="name" />
            <Input label="Email Address" type="email" id="email" />
            <Input label="Street" type="text" id="street" />
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code" />
                <Input label="City" type="text" id="city" />
            </div>
            (error & <Error title="Failed to submit order" message={error} />)
            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}