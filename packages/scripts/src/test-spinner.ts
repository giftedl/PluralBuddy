import ora from "ora";

const spinner = ora("hi").start()

setTimeout(() => spinner.stop(), 3000)