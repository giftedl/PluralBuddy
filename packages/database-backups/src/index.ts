import cron from "node-cron";
import { spawn } from "node:child_process";
import { lstat, mkdir, rm } from "node:fs/promises";
import { styleText } from "node:util";
import { tar } from "zip-a-folder";
import findRemoveSync from "find-remove";
import ora from "ora";

const crontest = false;

await backupDatabase();
await removeOldDumps();

cron.schedule(crontest ? "*/1 * * * *" : "0 0 * * */3", () => {
  backupDatabase();
});

cron.schedule(crontest ? "*/60 * * * *" : "0 0 * * 0", () => {
  removeOldDumps();
});

async function backupDatabase() {
  const spinner = ora({
    text: "Dumping database",
    spinner: "material",
  }).start();

  try {
    await new Promise<void>((y, n) => {
      const child = spawn("/usr/bin/env", [
        "mongodump",
        `--db=pluralbuddy${crontest ? "-canary" : ""}`,
        `--excludeCollection=analytics`,
        `--excludeCollection=messages`,
        `${process.env.MONGO}`,
      ]);
      child.stdout.setEncoding("utf8");
      child.stdout.on("data", (data) => {
        console.log(data.toString());
      });
      child.stderr.setEncoding("utf8");
      child.stderr.on("data", (data) => {
        spinner.clear();
        spinner.frame();
        console.log(
          styleText("whiteBright", `> ${(data.toString() as string).replaceAll("\n", "\n> ")}`),
        );
      });

      child.on("close", (e) => {
        spinner.succeed(`Done dumping with process code ${e}`);
        y();
      });
    });

    if (!(await lstat("dumps").catch(() => ({ isDirectory: () => null }))).isDirectory())
      await mkdir("dumps");

    const tarSpinner = ora({
      text: "Creating tar archives",
      spinner: "material",
    }).start();
    try {
      await tar(
        "dump",
        `dumps/${new Date().toLocaleString().replaceAll(" ", "-").replaceAll("/", "-").replaceAll(",", "-").replace("--", "_").toLocaleLowerCase()}-pb-dump.tar.gz`,
      );
      await rm("dump", { recursive: true, force: true });
      tarSpinner.succeed();
    } catch (e) {
      tarSpinner.fail("Failed tar archiving");
      console.error(e);
    }
  } catch (e) {
    spinner.fail("Failed while creating database backup");
    console.error(e);
  }
}

async function removeOldDumps() {
  const spinner = ora({
    text: "Deleting old archives",
    spinner: "material",
  }).start();
  const result = findRemoveSync("./dumps", {
    age: { seconds: crontest ? 1 : 604800 },
    extensions: [".gz"],
  });
  spinner.succeed(`Deleted old archives: ${JSON.stringify(result, null, 2)}`);
}
