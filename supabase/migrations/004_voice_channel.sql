-- 004_voice_channel.sql
-- Extend the messages.channel check constraint with the 'call' option so
-- voice campaigns can persist a message row per call.

alter table messages drop constraint if exists messages_channel_check;
alter table messages add constraint messages_channel_check
  check (channel in ('whatsapp', 'email', 'whatsapp_then_email', 'call'));
