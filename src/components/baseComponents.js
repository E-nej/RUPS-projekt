export class DraggableComponent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
    }

    startDrag(mouseX, mouseY) {
        this.isDragging = true;
        this.dragOffset.x = mouseX - this.x;
        this.dragOffset.y = mouseY - this.y;
    }

    drag(mouseX, mouseY) {
        if (this.isDragging) {
            this.x = mouseX - this.dragOffset.x;
            this.y = mouseY - this.dragOffset.y;
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    isPointInside(x, y) {
        // To be overridden
        throw new Error('isPointInside must be implemented by child classes');
    }

    draw(ctx) {
        // To be overridden
        throw new Error('draw must be implemented by child classes');
    }

    getConnectors() {
        // To be overridden
        return [];
    }
}