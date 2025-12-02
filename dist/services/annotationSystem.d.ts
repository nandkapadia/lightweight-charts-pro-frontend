import { Annotation, AnnotationLayer, AnnotationText } from '../types';
import { ShapeData } from '../types/ChartInterfaces';
import { SeriesMarker, Time } from 'lightweight-charts';
/**
 * Result of annotation processing containing all visual elements
 *
 * @interface AnnotationVisualElements
 * @property {SeriesMarker<Time>[]} markers - Lightweight Charts markers (arrows, shapes)
 * @property {ShapeData[]} shapes - Custom shape primitives (rectangles, lines)
 * @property {AnnotationText[]} texts - Text label annotations
 */
export interface AnnotationVisualElements {
    markers: SeriesMarker<Time>[];
    shapes: ShapeData[];
    texts: AnnotationText[];
}
export declare const createAnnotationVisualElements: (annotations: Annotation[]) => AnnotationVisualElements;
export declare function filterAnnotationsByTimeRange(annotations: Annotation[], startTime: string, endTime: string): Annotation[];
export declare function filterAnnotationsByPriceRange(annotations: Annotation[], minPrice: number, maxPrice: number): Annotation[];
export declare function createAnnotationLayer(name: string, annotations?: Annotation[]): AnnotationLayer;
//# sourceMappingURL=annotationSystem.d.ts.map