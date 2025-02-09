import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-image-view',
    imports: [ CommonModule ],
    templateUrl: './image-view.component.html',
    styleUrl: './image-view.component.scss'
})
export class ImageViewComponent {
    @Input() imageSrc: string = '';
    @Output() close = new EventEmitter<void>();    
    isModalOpen: boolean = false;
    zoomLevel: number = 1;
    minScale = 1;
    maxScale = 3;
    lastPinchDistance: number | null = null;

    OpenModal(imageSrc: string) {
        console.log("open image: " + imageSrc);
        this.imageSrc = imageSrc;
        this.zoomLevel = 1;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.close.emit();
    }

    zoomImage(event: WheelEvent) {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        const newScale = this.zoomLevel * zoomFactor;
        if (newScale >= this.minScale && newScale <= this.maxScale) {
            this.zoomLevel = newScale;
        }
    }

    handleTouchMove(event: TouchEvent) {
        if (event.touches.length === 2) {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            if (this.lastPinchDistance) {
                const scaleChange = currentDistance / this.lastPinchDistance;
                this.zoomLevel *= scaleChange;
                this.zoomLevel = Math.min(Math.max(this.zoomLevel, this.minScale), this.maxScale);
            }

            this.lastPinchDistance = currentDistance;
        }
    }

    handleTouchEnd() {
        this.lastPinchDistance = null;
    }
}
