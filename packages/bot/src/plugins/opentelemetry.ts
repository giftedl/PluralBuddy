import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { opentelemetry } from "@slipher/opentelemetry";
import { PrometheusExporter, PrometheusSerializer } from "@opentelemetry/exporter-prometheus"

const options = { port: 9464 };
export const exporter = new PrometheusExporter(options);
exporter.stopServer()

export async function getExporterAsPlainText() {
    const collection = await exporter.collect()
    const serializer = new PrometheusSerializer('', false, undefined, false, false);
    const { resourceMetrics, errors } = collection;

    if (errors.length) {
        throw new Error(errors.toString())
    }

    return serializer.serialize(resourceMetrics);
}

export function openTelemetry() {
	return opentelemetry({
		serviceName: "pluralbuddy",
		spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
		metricReader: exporter
	});
}