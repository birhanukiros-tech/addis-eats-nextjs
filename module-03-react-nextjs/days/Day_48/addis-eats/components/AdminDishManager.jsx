
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DISHES_UPDATED_EVENT,
  readBrowserDishes,
  writeBrowserDishes,
} from "@/lib/dish-storage";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "fasting",
  spicy: false,
  image: "/images/shiro.png",
};

export default function AdminDishManager({ initialDishes }) {
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function refreshDishes() {
      setDishes(readBrowserDishes(initialDishes));
      setLoaded(true);
    }

    refreshDishes();

    window.addEventListener("storage", refreshDishes);
    window.addEventListener(DISHES_UPDATED_EVENT, refreshDishes);

    return () => {
      window.removeEventListener("storage", refreshDishes);
      window.removeEventListener(DISHES_UPDATED_EVENT, refreshDishes);
    };
  }, [initialDishes]);

  function updateForm(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setIsFormOpen(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    const category = form.category.trim();
    const image = form.image.trim() || "/images/shiro.png";

    if (
      !name ||
      !description ||
      !category ||
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setMessage(
        "Enter a name, description, category, and valid non-negative price."
      );
      return;
    }

    if (!image.startsWith("/images/")) {
      setMessage(
        "Use an image path from the public images folder, such as /images/shiro.png."
      );
      return;
    }

    let updatedDishes;

    if (editingId !== null) {
      updatedDishes = dishes.map((dish) =>
        String(dish.id) === String(editingId)
          ? {
              ...dish,
              name,
              description,
              price,
              category,
              image,
              spicy: form.spicy,
            }
          : dish
      );
    } else {
      const nextId =
        Math.max(0, ...dishes.map((dish) => Number(dish.id) || 0)) + 1;

      updatedDishes = [
        {
          id: nextId,
          name,
          description,
          price,
          category,
          image,
          spicy: form.spicy,
          enabled: true,
        },
        ...dishes,
      ];
    }

    if (!writeBrowserDishes(updatedDishes)) {
      setMessage("The changes could not be saved in this browser.");
      return;
    }

    setDishes(updatedDishes);
    setMessage(editingId !== null ? "Dish updated." : "Dish added.");
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  }

  function handleEdit(dish) {
    setEditingId(dish.id);
    setForm({
      name: dish.name || "",
      description: dish.description || "",
      price: String(dish.price ?? ""),
      category: dish.category || "fasting",
      spicy: Boolean(dish.spicy),
      image: dish.image || "/images/shiro.png",
    });

    setMessage("");
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggle(dishId) {
    const updatedDishes = dishes.map((dish) =>
      String(dish.id) === String(dishId)
        ? { ...dish, enabled: dish.enabled === false }
        : dish
    );

    if (!writeBrowserDishes(updatedDishes)) {
      setMessage("The status could not be saved.");
      return;
    }

    setDishes(updatedDishes);
    setMessage("Dish availability updated.");
  }

  function confirmDelete() {
    if (!dishToDelete) return;

    const updatedDishes = dishes.filter(
      (dish) => String(dish.id) !== String(dishToDelete.id)
    );

    if (!writeBrowserDishes(updatedDishes)) {
      setMessage("The dish could not be deleted.");
      setDishToDelete(null);
      return;
    }

    setDishes(updatedDishes);

    if (String(editingId) === String(dishToDelete.id)) {
      resetForm();
    }

    setMessage(`${dishToDelete.name} was deleted.`);
    setDishToDelete(null);
  }

  if (!loaded) {
    return <p className="py-8 text-[#666666]">Loading dishes...</p>;
  }

  return (
    <div className="space-y-8">
      {/* Add dish button */}
      {!isFormOpen && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#2F2F2F]">
              Menu Management
            </h2>
            <p className="mt-1 text-sm text-[#666666]">
              Add and manage your restaurant dishes.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white transition hover:bg-[#A64B5D]"
          >
            <span aria-hidden="true" className="text-xl">+</span>
            Add New Dish
          </button>
        </div>
      )}

      {/* Add/Edit form */}
      {isFormOpen && (
        <section className="rounded-2xl border border-[#E8DDD8] bg-[#FCFAF6] p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-[#2F2F2F]">
                {editingId !== null ? "Edit Dish" : "Add New Dish"}
              </h2>
              <p className="mt-1 text-sm text-[#666666]">
                Complete the dish details below.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              aria-label="Close dish form"
              className="rounded-lg px-3 py-1 text-2xl text-[#666666] hover:bg-[#E8DDD8]"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dish-name" className="mb-1 block font-semibold">
                Dish name
              </label>
              <input
                id="dish-name"
                name="name"
                value={form.name}
                onChange={updateForm}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3"
                placeholder="e.g. Kitfo"
              />
            </div>

            <div>
              <label htmlFor="dish-price" className="mb-1 block font-semibold">
                Price (ETB)
              </label>
              <input
                id="dish-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateForm}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3"
                placeholder="200"
              />
            </div>

            <div>
              <label
                htmlFor="dish-category"
                className="mb-1 block font-semibold"
              >
                Category
              </label>
              <input
                id="dish-category"
                name="category"
                value={form.category}
                onChange={updateForm}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3"
                placeholder="fasting, traditional, drinks..."
              />
            </div>

            <div>
              <label htmlFor="dish-image" className="mb-1 block font-semibold">
                Image path
              </label>
              <input
                id="dish-image"
                name="image"
                value={form.image}
                onChange={updateForm}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3"
                placeholder="/images/shiro.png"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="dish-description"
                className="mb-1 block font-semibold"
              >
                Description
              </label>
              <textarea
                id="dish-description"
                name="description"
                value={form.description}
                onChange={updateForm}
                rows={3}
                required
                className="w-full rounded-xl border border-[#D8C9C5] px-4 py-3"
                placeholder="Describe the dish..."
              />
            </div>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                name="spicy"
                type="checkbox"
                checked={form.spicy}
                onChange={updateForm}
                className="h-4 w-4 accent-[#7A263A]"
              />
              <span className="font-medium">Spicy dish</span>
            </label>

            {message && (
              <p
                role="status"
                className="text-sm font-semibold text-[#7A263A] sm:col-span-2"
              >
                {message}
              </p>
            )}

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-[#7A263A] px-5 py-3 font-bold text-white transition hover:bg-[#A64B5D]"
              >
                {editingId !== null ? "Save Changes" : "Add Dish"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#D8C9C5] px-5 py-3 font-semibold text-[#2F2F2F] transition hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Status message and dishes list */}
      {message && !isFormOpen && (
        <p
          role="status"
          className="rounded-xl bg-[#EEF4EE] px-4 py-3 text-sm font-semibold text-[#32653A]"
        >
          {message}
        </p>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#2F2F2F]">
            Menu Dishes
          </h2>
          <p className="text-sm text-[#666666]">
            {dishes.length} {dishes.length === 1 ? "dish" : "dishes"}
          </p>
        </div>

        {dishes.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DDD8] bg-white p-8 text-center">
            <p className="font-semibold text-[#2F2F2F]">No dishes yet.</p>
            <p className="mt-1 text-sm text-[#666666]">
              Select Add New Dish to create your first dish.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dishes.map((dish) => {
              const enabled = dish.enabled !== false;

              return (
                <article
                  key={dish.id}
                  className="flex flex-col gap-4 rounded-2xl border border-[#E8DDD8] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <Image
                    src={dish.image || "/images/shiro.png"}
                    alt={dish.name}
                    width={88}
                    height={72}
                    className="h-[72px] w-[88px] rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[#2F2F2F]">
                        {dish.name}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          enabled
                            ? "bg-[#EAF3E9] text-[#32653A]"
                            : "bg-[#F1E2E5] text-[#7A263A]"
                        }`}
                      >
                        {enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#666666]">
                      {dish.category} · {dish.price} ETB
                    </p>
                    <p className="mt-1 text-sm text-[#777777]">
                      {dish.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handleEdit(dish)}
                      className="rounded-lg border border-[#7A263A] px-3 py-2 text-sm font-semibold text-[#7A263A] transition hover:bg-[#F1E2E5]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(dish.id)}
                      className="rounded-lg border border-[#D8C9C5] px-3 py-2 text-sm font-semibold text-[#2F2F2F] transition hover:bg-[#F8F4EC]"
                    >
                      {enabled ? "Disable" : "Enable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDishToDelete(dish)}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* In-page delete confirmation dialog */}
      {dishToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDishToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dish-title"
            aria-describedby="delete-dish-description"
            className="w-full max-w-md rounded-3xl border border-[#E8DDD8] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-700">
              <span aria-hidden="true">!</span>
            </div>

            <h2
              id="delete-dish-title"
              className="text-2xl font-bold text-[#2F2F2F]"
            >
              Delete this dish?
            </h2>

            <p
              id="delete-dish-description"
              className="mt-3 leading-7 text-[#666666]"
            >
              Are you sure you want to delete{" "}
              <strong className="text-[#2F2F2F]">
                {dishToDelete.name}
              </strong>
              ? This removes it from this browser&apos;s saved menu.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDishToDelete(null)}
                className="rounded-xl border border-[#D8C9C5] px-5 py-3 font-semibold text-[#2F2F2F] transition hover:bg-[#F8F4EC]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800"
              >
                Delete Dish
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
