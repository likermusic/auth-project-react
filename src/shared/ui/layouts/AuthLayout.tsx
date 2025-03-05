import React, { ReactNode } from "react";

export function AuthLayout({
  title,
  form,
}: {
  form: ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <main className="rounded-xl border border-slate-300 px-14 py-8 pb-14 w-full max-w-[400px] bg-white ">
        <h1 className="text-2xl mb-6">{title}</h1>
        {form}
      </main>
    </div>
  );
}
