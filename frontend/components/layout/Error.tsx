export const ErrorMessage = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-md text-center">
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
        エラーが発生しました
      </h1>
      <p className="mt-4 text-muted-foreground">
        申し訳ございません。予期せぬエラーが発生しました。しばらくしてから再度お試しください。問題が解決しない場合は、サポートにご連絡ください。
      </p>
    </div>
  </div>
);
