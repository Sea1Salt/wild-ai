-- AWiSBA demo seed data
-- Run this in Supabase SQL Editor.
-- It adds connected demo data across every current AWiSBA table.

with ranked_devices as (
  select id, row_number() over (order by created_at desc) as rn
  from public.devices
),
demo_devices as (
  select
    max(id) filter (where rn = 1) as primary_device_id,
    coalesce(max(id) filter (where rn = 2), max(id) filter (where rn = 1)) as secondary_device_id
  from ranked_devices
),
updated_devices as (
  update public.devices as d
  set
    status = case when d.id = demo_devices.primary_device_id then 'online' else 'offline' end,
    battery = case when d.id = demo_devices.primary_device_id then 87 else 18 end,
    signal_strength = case when d.id = demo_devices.primary_device_id then 'Strong' else 'Weak' end,
    storage_available = case when d.id = demo_devices.primary_device_id then 64 else 29 end,
    pending_uploads = case when d.id = demo_devices.primary_device_id then 0 else 4 end,
    last_upload_at = case
      when d.id = demo_devices.primary_device_id then now() - interval '5 minutes'
      else now() - interval '13 hours'
    end,
    latest_sounds = case
      when d.id = demo_devices.primary_device_id then '["Bird", "Frog", "Insect"]'::jsonb
      else '["Noise", "Insect", "Unknown"]'::jsonb
    end,
    indicator = case when d.id = demo_devices.primary_device_id then 'High' else 'Low' end,
    indicator_score = case when d.id = demo_devices.primary_device_id then 78 else 42 end,
    noise = case when d.id = demo_devices.primary_device_id then 'Low' else 'High' end,
    confidence = case when d.id = demo_devices.primary_device_id then 82 else 61 end,
    updated_at = now()
  from demo_devices
  where d.id in (demo_devices.primary_device_id, demo_devices.secondary_device_id)
  returning d.id
),
inserted_health_logs as (
  insert into public.device_health_logs (
    device_id,
    battery,
    signal_strength,
    storage_available,
    pending_uploads,
    status,
    logged_at
  )
  select primary_device_id, 91, 'Strong', 70, 0, 'online', now() - interval '6 hours' from demo_devices
  union all
  select primary_device_id, 89, 'Strong', 67, 0, 'online', now() - interval '3 hours' from demo_devices
  union all
  select primary_device_id, 87, 'Strong', 64, 0, 'online', now() - interval '10 minutes' from demo_devices
  union all
  select secondary_device_id, 23, 'Weak', 34, 2, 'online', now() - interval '18 hours' from demo_devices
  union all
  select secondary_device_id, 18, 'Weak', 29, 4, 'offline', now() - interval '13 hours' from demo_devices
  returning id
),
inserted_audio as (
  insert into public.audio_uploads (
    device_id,
    file_name,
    file_path,
    content_type,
    duration_seconds,
    file_size,
    processing_status,
    uploaded_at,
    recorded_at,
    chunk_duration_seconds
  )
  select primary_device_id, 'demo_primary_0500_bird.wav', 'demo/field/primary/0500_bird.wav', 'audio/wav', 5, 184320, 'Completed', now() - interval '6 hours', now() - interval '6 hours', 5 from demo_devices
  union all
  select primary_device_id, 'demo_primary_0900_insect.wav', 'demo/field/primary/0900_insect.wav', 'audio/wav', 5, 181248, 'Completed', now() - interval '3 hours', now() - interval '3 hours', 5 from demo_devices
  union all
  select primary_device_id, 'demo_primary_1800_frog.wav', 'demo/field/primary/1800_frog.wav', 'audio/wav', 5, 187440, 'Completed', now() - interval '35 minutes', now() - interval '35 minutes', 5 from demo_devices
  union all
  select secondary_device_id, 'demo_secondary_1842_unknown.wav', 'demo/field/secondary/1842_unknown.wav', 'audio/wav', 5, 176112, 'Completed', now() - interval '13 hours', now() - interval '13 hours', 5 from demo_devices
  returning id, device_id, file_name, recorded_at
),
inserted_runs as (
  insert into public.inference_runs (
    audio_upload_id,
    model_name,
    model_version,
    status,
    dominant_group,
    highest_confidence,
    started_at,
    finished_at
  )
  select
    id,
    'AWiSBA Field Acoustic Classifier',
    'demo-v1.0',
    'Completed',
    case
      when file_name like '%bird%' then 'Bird'
      when file_name like '%insect%' then 'Insect'
      when file_name like '%frog%' then 'Frog'
      else 'Unknown'
    end,
    case
      when file_name like '%unknown%' then 0.54
      when file_name like '%insect%' then 0.81
      when file_name like '%frog%' then 0.86
      else 0.88
    end,
    recorded_at + interval '10 seconds',
    recorded_at + interval '18 seconds'
  from inserted_audio
  returning id, audio_upload_id, dominant_group, highest_confidence
),
inserted_events as (
  insert into public.device_sound_events (
    device_id,
    audio_upload_id,
    inference_run_id,
    event_started_at,
    event_duration_seconds,
    sound_groups,
    dominant_sound_group,
    noise_level,
    confidence,
    status,
    needs_review
  )
  select
    inserted_audio.device_id,
    inserted_audio.id,
    inserted_runs.id,
    inserted_audio.recorded_at,
    5,
    case
      when inserted_audio.file_name like '%bird%' then '["Bird", "Insect"]'::jsonb
      when inserted_audio.file_name like '%insect%' then '["Insect", "Noise"]'::jsonb
      when inserted_audio.file_name like '%frog%' then '["Frog", "Bird", "Insect"]'::jsonb
      else '["Unknown", "Noise"]'::jsonb
    end,
    inserted_runs.dominant_group,
    case
      when inserted_audio.file_name like '%unknown%' then 'High'
      when inserted_audio.file_name like '%insect%' then 'Moderate'
      else 'Low'
    end,
    inserted_runs.highest_confidence,
    case when inserted_audio.file_name like '%unknown%' then 'Review Needed' else 'Detected' end,
    inserted_audio.file_name like '%unknown%'
  from inserted_audio
  join inserted_runs on inserted_runs.audio_upload_id = inserted_audio.id
  returning id, needs_review
),
inserted_reviews as (
  insert into public.unknown_reviews (
    device_sound_event_id,
    review_status,
    reviewed_label,
    note,
    reviewed_at
  )
  select
    id,
    'Pending',
    null,
    'Demo: low confidence acoustic event queued for human review.',
    null
  from inserted_events
  where needs_review = true
  returning id
),
inserted_indicators as (
  insert into public.acoustic_indicators (
    device_id,
    period_start,
    period_end,
    indicator_level,
    indicator_score,
    noise_level,
    average_confidence,
    dominant_sound_group,
    secondary_sound_group,
    peak_activity_window,
    detected_sound_groups,
    active_chunk_count,
    created_at
  )
  select
    primary_device_id,
    date_trunc('hour', now() - interval '6 hours'),
    date_trunc('hour', now()),
    'High',
    78,
    'Low',
    0.82,
    'Frog',
    'Bird',
    '18:00 - 19:00',
    '["Bird", "Frog", "Insect"]'::jsonb,
    3,
    now()
  from demo_devices
  union all
  select
    secondary_device_id,
    date_trunc('hour', now() - interval '18 hours'),
    date_trunc('hour', now() - interval '12 hours'),
    'Low',
    42,
    'High',
    0.61,
    'Noise',
    'Insect',
    '18:00 - 19:00',
    '["Noise", "Insect", "Unknown"]'::jsonb,
    1,
    now()
  from demo_devices
  returning id
),
inserted_analysis_uploads as (
  insert into public.analysis_uploads (
    file_name,
    file_path,
    content_type,
    duration_seconds,
    file_size,
    processing_status,
    uploaded_at,
    created_at,
    updated_at
  ) values (
    'demo_user_uploaded_forest_audio.wav',
    'demo/analysis/demo_user_uploaded_forest_audio.wav',
    'audio/wav',
    20,
    734720,
    'Completed',
    now() - interval '20 minutes',
    now() - interval '20 minutes',
    now() - interval '19 minutes'
  )
  returning id
),
inserted_analysis_runs as (
  insert into public.analysis_runs (
    analysis_upload_id,
    model_name,
    model_version,
    status,
    dominant_group,
    highest_confidence,
    error_message,
    started_at,
    finished_at,
    created_at,
    updated_at
  )
  select
    id,
    'AWiSBA Smart Acoustic Analyzer',
    'demo-v1.0',
    'Completed',
    'Bird',
    0.88,
    null,
    now() - interval '19 minutes',
    now() - interval '18 minutes',
    now() - interval '19 minutes',
    now() - interval '18 minutes'
  from inserted_analysis_uploads
  returning id
),
inserted_analysis_segments as (
  insert into public.analysis_segments (
    analysis_run_id,
    start_second,
    end_second,
    sound_group,
    confidence,
    status,
    created_at
  )
  select id, 0, 5, 'Bird', 0.88, 'Detected', now() from inserted_analysis_runs
  union all
  select id, 5, 10, 'Frog', 0.76, 'Detected', now() from inserted_analysis_runs
  union all
  select id, 10, 15, 'Insect', 0.81, 'Detected', now() from inserted_analysis_runs
  union all
  select id, 15, 20, 'Unknown', 0.54, 'Review Needed', now() from inserted_analysis_runs
  returning id
)
select
  (select count(*) from updated_devices) as devices_updated,
  (select count(*) from inserted_health_logs) as device_health_logs_inserted,
  (select count(*) from inserted_audio) as audio_uploads_inserted,
  (select count(*) from inserted_runs) as inference_runs_inserted,
  (select count(*) from inserted_events) as device_sound_events_inserted,
  (select count(*) from inserted_reviews) as unknown_reviews_inserted,
  (select count(*) from inserted_indicators) as acoustic_indicators_inserted,
  (select count(*) from inserted_analysis_uploads) as analysis_uploads_inserted,
  (select count(*) from inserted_analysis_runs) as analysis_runs_inserted,
  (select count(*) from inserted_analysis_segments) as analysis_segments_inserted;
