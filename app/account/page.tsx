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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        setFirstName(user.user_metadata?.first_name ?? "");
        setLastName(user.user_metadata?.last_name ?? "");
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

    const { data, error } = await supabase.auth.updateUser({
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
    setFirstName(data.user.user_metadata?.first_name ?? "");
    setLastName(data.user.user_metadata?.last_name ?? "");

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
    <main className="min-h-screen bg-[#F0EEE9] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1
          className={`${loveYaLikeASister.className} text-[48px] text-black`}
        >
          Account
        </h1>

        {/* Account information */}
        <div className="mt-8 rounded-xl border border-white/40 bg-white/20 p-6 shadow-md backdrop-blur-[0.75px]">
          <h2
            className={`${loveYaLikeASister.className} mb-6 text-[32px] text-black`}
          >
            Profile
          </h2>

          {/* First name */}
          <div className="mb-5">
            <label
              className={`${itim.className} block text-[20px] text-gray-500`}
            >
              First Name
            </label>

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className={`${itim.className} mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[20px] text-black outline-none focus:border-[#2573B8]`}
            />
          </div>

          {/* Last name */}
          <div className="mb-5">
            <label
              className={`${itim.className} block text-[20px] text-gray-500`}
            >
              Last Name
            </label>

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className={`${itim.className} mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-[20px] text-black outline-none focus:border-[#2573B8]`}
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <p
              className={`${itim.className} text-[20px] text-gray-500`}
            >
              Email
            </p>

            <p
              className={`${itim.className} mt-1 text-[22px] text-black`}
            >
              {user?.email ?? "Loading..."}
            </p>
          </div>

          {/* Messages */}
          {saveError && (
            <p
              className={`${itim.className} mb-4 text-[17px] text-red-600`}
            >
              {saveError}
            </p>
          )}

          {saveMessage && (
            <p
              className={`${itim.className} mb-4 text-[17px] text-green-700`}
            >
              {saveMessage}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className={`${itim.className} rounded-lg bg-[#2573B8] px-5 py-2 text-[20px] text-white transition hover:bg-[#1c609c] disabled:opacity-50`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleLogout}
              className={`${itim.className} rounded-lg border border-gray-300 bg-white px-5 py-2 text-[20px] text-gray-700 transition hover:bg-gray-100`}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 rounded-xl border border-red-300 bg-red-50 p-6 shadow-md">
          <h2
            className={`${loveYaLikeASister.className} text-[32px] text-red-700`}
          >
            Danger Zone
          </h2>

          <p
            className={`${itim.className} mt-2 text-[18px] text-gray-700`}
          >
            Permanently delete your HeadStart account and all of your
            saved data. This cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={`${itim.className} mt-5 rounded-lg bg-red-600 px-5 py-2 text-[20px] text-white transition hover:bg-red-700`}
            >
              Delete Account
            </button>
          ) : (
            <div className="mt-5 rounded-lg border border-red-300 bg-white/60 p-4">
              <p
                className={`${itim.className} text-[18px] text-red-700`}
              >
                Are you sure? Your account, classes, assignments, and
                checkpoints will be permanently deleted.
              </p>

              {deleteError && (
                <p
                  className={`${itim.className} mt-3 text-[16px] text-red-600`}
                >
                  {deleteError}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className={`${itim.className} rounded-lg bg-red-600 px-5 py-2 text-[18px] text-white transition hover:bg-red-700 disabled:opacity-50`}
                >
                  {deleting
                    ? "Deleting..."
                    : "Yes, Delete My Account"}
                </button>

                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError("");
                  }}
                  disabled={deleting}
                  className={`${itim.className} rounded-lg border border-gray-300 bg-white px-5 py-2 text-[18px] text-gray-700 transition hover:bg-gray-100 disabled:opacity-50`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}