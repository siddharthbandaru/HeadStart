"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Love_Ya_Like_A_Sister, Itim } from "next/font/google";

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  weight: "400",
  subsets: ["latin"],
});

const itim = Itim({
  weight: "400",
  subsets: ["latin"],
});

const notebookBackground = {
  backgroundColor: "#F0EEE9",
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent 0px, transparent 35px, #8db5c7a7 35px, #8db5c7a7 36px), linear-gradient(to right, transparent 115px, #E44B4B 115px, #E44B4B 116px, transparent 116px)",
};

const inputStyle =
  "mt-2 w-full rounded-lg border border-white/50 bg-white/40 px-4 py-3 text-[18px] text-black outline-none transition placeholder:text-gray-400 focus:border-[#2573B8] focus:bg-white/60 focus:ring-2 focus:ring-[#2573B8]/20";

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  // Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        setFirstName(
          user.user_metadata?.first_name ?? ""
        );
        setLastName(
          user.user_metadata?.last_name ?? ""
        );
      }
    };

    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    setSaveMessage("");
    setSaveError("");

    if (!firstName.trim()) {
      setSaveError("First name is required.");
      return;
    }

    setSaving(true);

    const { data, error } =
      await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      });

    setSaving(false);

    if (error) {
      setSaveError(error.message);
      return;
    }

    setUser(data.user);
    setFirstName(
      data.user.user_metadata?.first_name ?? ""
    );
    setLastName(
      data.user.user_metadata?.last_name ?? ""
    );

    setSaveMessage("Profile updated!");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setDeleteError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setDeleteError("You must be logged in.");
        return;
      }

      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteError(
          result.error ?? "Could not delete account."
        );
        return;
      }

      await supabase.auth.signOut();

      router.push("/signup");
      router.refresh();
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main
      className={`min-h-screen px-6 py-12 ${itim.className}`}
      style={notebookBackground}
    >
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1
            className={`${loveYaLikeASister.className} text-[44px] leading-tight text-black`}
          >
            Account
          </h1>

          <p className="mt-2 text-[19px] text-gray-600">
            Manage your Head
            <span className="text-[#2573B8]">
              Start
            </span>{" "}
            profile.
          </p>
        </div>

        {/* Profile */}
        <section className="rounded-xl border border-white/40 bg-white/20 p-6 shadow-md backdrop-blur-[0.75px] sm:p-8">
          <div className="mb-6">
            <h2
              className={`${loveYaLikeASister.className} text-[32px] leading-tight text-black`}
            >
              Your Profile
            </h2>

            <p className="mt-1 text-[17px] text-gray-600">
              Update your personal information.
            </p>
          </div>

          {/* First name */}
          <div className="mb-5">
            <label
              htmlFor="first-name"
              className="block text-[18px] text-gray-700"
            >
              First Name
            </label>

            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              placeholder="First name"
              autoComplete="given-name"
              className={inputStyle}
            />
          </div>

          {/* Last name */}
          <div className="mb-5">
            <label
              htmlFor="last-name"
              className="block text-[18px] text-gray-700"
            >
              Last Name
            </label>

            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              placeholder="Last name"
              autoComplete="family-name"
              className={inputStyle}
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label
              htmlFor="account-email"
              className="block text-[18px] text-gray-700"
            >
              Email
            </label>

            <input
              id="account-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              placeholder={
                user ? "" : "Loading..."
              }
              className="mt-2 w-full cursor-not-allowed rounded-lg border border-white/40 bg-white/20 px-4 py-3 text-[18px] text-gray-500 outline-none"
            />

            <p className="mt-2 text-[14px] text-gray-500">
              Your account email cannot be changed
              here.
            </p>
          </div>

          {/* Error */}
          {saveError && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-300 bg-red-50/70 px-4 py-3 text-[16px] text-red-700"
            >
              {saveError}
            </div>
          )}

          {/* Success */}
          {saveMessage && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-300 bg-green-50/70 px-4 py-3 text-[16px] text-green-700"
            >
              {saveMessage}
            </div>
          )}

          {/* Profile actions */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="rounded-lg bg-[#2573B8] px-5 py-3 text-[18px] text-white shadow-sm transition hover:bg-[#1c609c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/50 bg-white/30 px-5 py-3 text-[18px] text-gray-700 transition hover:bg-white/50"
            >
              Log Out
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-8 rounded-xl border border-red-300/70 bg-red-50/30 p-6 shadow-md backdrop-blur-[0.75px] sm:p-8">
          <h2
            className={`${loveYaLikeASister.className} text-[30px] text-[#9c2133]`}
          >
            Danger Zone
          </h2>

          <p className="mt-2 max-w-xl text-[17px] leading-relaxed text-gray-600">
            Permanently delete your HeadStart account
            and all of your saved data. This action
            cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() =>
                setShowDeleteConfirm(true)
              }
              className="mt-5 rounded-lg border border-[#9c2133] bg-transparent px-5 py-2.5 text-[18px] text-[#9c2133] transition hover:bg-red-50"
            >
              Delete Account
            </button>
          ) : (
            <div className="mt-5 rounded-xl border border-red-300/70 bg-white/30 p-5">
              <h3
                className={`${loveYaLikeASister.className} text-[24px] text-[#9c2133]`}
              >
                Delete your account?
              </h3>

              <p className="mt-2 text-[17px] leading-relaxed text-gray-700">
                Your account, classes, assignments,
                and checkpoints will be permanently
                deleted.
              </p>

              <p className="mt-2 text-[16px] font-medium text-[#9c2133]">
                This cannot be undone.
              </p>

              {deleteError && (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-300 bg-red-50/70 px-4 py-3 text-[16px] text-red-700"
                >
                  {deleteError}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="rounded-lg bg-[#9c2133] px-5 py-2.5 text-[17px] text-white transition hover:bg-[#801a2a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting
                    ? "Deleting..."
                    : "Yes, Delete My Account"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError("");
                  }}
                  disabled={deleting}
                  className="rounded-lg border border-white/50 bg-white/30 px-5 py-2.5 text-[17px] text-gray-700 transition hover:bg-white/50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}