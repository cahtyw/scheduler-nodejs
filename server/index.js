/* eslint-disable no-console */
import schedule from 'node-schedule';
import root from 'app-root-path';
import fs from 'fs';
import Knex from 'knex';

const schedules = [];

const tasks = JSON.parse(fs.readFileSync(`${root}/scheduler.json`));

tasks.rules.forEach((element) => {
  const rule = new schedule.RecurrenceRule();
  rule.second = element.every.seconds !== false ? element.every.seconds : null;
  rule.hour = element.every.hour !== false ? element.every.hour : null;
  rule.minute = element.every.minute !== false ? element.every.minute : null;

  schedules.push(
    schedule.scheduleJob(rule, async () => {
      const knex = Knex(element.database);
      try {
        await knex.raw(element.action);
        console.log(element.description);
      } catch (error) {
        console.log(error);
      }
      knex.destroy();
    }),
  );
});
