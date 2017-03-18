(function(window, document, undefined) {
    'use strict';

    var InertiaClass = function()
    {

        this.deltas = [null, null, null, null, null, null, null, null, null]
        this.timer = null
        this.lock = 0
        this.direction = undefined
        this.cb = undefined
        this.seen = 0

    }

    InertiaClass.prototype.update = function(delta) {
        // Check for an inertial peak. And if found, lock the peak
        // checking for 10 more events (decremented in hasPeak on
        // each new event) to prevent the sample window from registering
        // true more than once for each peak.
        if (this.hasPeak()) {
            this.lock = 10;
            this.seen++;
            this.direction = (delta > 0) ? 1 : -1;
            this.cb(this.direction)
        }
        // Shift the deltas backward and add the newest (maintaining the sample window).
        this.deltas.shift();
        this.deltas.push(Math.abs(delta));
    }


    InertiaClass.prototype.addCallback = function(callback) {
        this.cb = callback;
    }

    InertiaClass.prototype.hasPeak = function() {
        // Decrement the lock.
        if (this.lock > 0) {
            this.lock--;
            return false;
        }

        // If the oldest delta is null, there can't be a peak yet; so return.
        if (this.deltas[0] == null) return false;

        // Otherwise, check for a peak signature where the middle delta (4)
        // is the highest among all other deltas to the left or right.
        if (
            this.deltas[0] <  this.deltas[4] &&
            this.deltas[1] <= this.deltas[4] &&
            this.deltas[2] <= this.deltas[4] &&
            this.deltas[3] <= this.deltas[4] &&
            this.deltas[5] <= this.deltas[4] &&
            this.deltas[6] <= this.deltas[4] &&
            this.deltas[7] <= this.deltas[4] &&
            this.deltas[8] <  this.deltas[4]
        ) return true;

        // If no peak is found, return false.
        return false;
    }

    InertiaClass.prototype.init = function() {
        console.log(this.deltas);
    };

    window.InertiaClass = InertiaClass

}(window, document));