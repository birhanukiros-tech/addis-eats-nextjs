"use client";
import { placeOrder } from "@/app/actions";
import { useActionState } from "react";

function OrderForm() {
    const [state, formAction, pending] = useActionState(placeOrder,null);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
        {state?.fieldErrors?.name && (
            <p role="alert">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="text" />

        {state?.fieldErrors?.phone && (
            <p role="alert">{state.fieldErrors.phone}</p>
        )}
      </div>

      <button type="submit" disabled={pending}>{pending ? "sending..." : "Place Order"}</button>

        {state?.success && (
            <p>{state.message}</p>
        )}
    </form>
  );
}

export default OrderForm;
