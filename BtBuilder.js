// function buildTree(bt) {

//     var entity = this.entity;
//     var d1, d2, d3, d4, d5;
//     d1 = this.addNode(this.root, "Selector", "Live");


//     // Safe?
//     d2 = this.addNode(d1, "Sequence", "Danger?");
//         this.addNode(d2, "Action", "Low Health?", function() {entity.getHealth()});
//         this.addNode(d2, "Action", "Threats?", function() {entity.getThreat()});
//         // d3 = this.addNode(d2, "Selector", "F(l?)ight");
//             d3 = this.addNode(d2, "Sequence", "Fight");
//                 this.addNode(d3, "Action", "Threshold", function() {entity.getAggression()});
//                 this.addNode(d3, "Action", "Get Location", function() {entity.getLocation("Attack")});
//                 this.addNode(d3, "Action", "Find", function() {entity.moveToFind("Attack")});
//                 this.addNode(d3, "Action", "Attack", function() {entity.attack()});
//             // d4 = this.addNode(d3, "Sequence", "Flight");
//             // this.addNode(d4, "Action", "Safe Location", function() {entity.getLocation("Safe")});
//             // this.addNode(d4, "Action", "Run", function() {entity.moveTo()});

//     // Hungry
//     d2 = this.addNode(d1, "Sequence", "Hungry?");
//         this.addNode(d2, "Action", "Threshold", function() {entity.getStamina()});
//         d3 = this.addNode(d2, "Sequence", "Find Food");
//             d4 = this.addNode(d3, "Selector", "Get location");
//                 this.addNode(d4, "Action", "Known", function() {entity.getLocation("Food")});
//                 this.addNode(d4, "Action", "Random", function() {entity.getLocation("Random")});
//             this.addNode(d3, "Action", "Find", function() {entity.moveToFind("Food")});
//             this.addNode(d3, "Action", "Eat", function() {entity.eat()});

//     // Mate?
//     d2 = this.addNode(d1, "Sequence", "Mate?");
//         this.addNode(d2, "Action", "Threshold", function() {entity.getMatingTimer()});
//         var d3 = this.addNode(d2, "Sequence", "Find Mate");
//             d4 = this.addNode(d3, "Selector", "Get location");
//                 this.addNode(d4, "Action", "Known", function() {entity.getLocation("Mate")});
//                 this.addNode(d4, "Action", "Random", function() {entity.getLocation("Random")});
//             this.addNode(d3, "Action", "Find", function() {entity.moveToFind("Mate")});
//             this.addNode(d3, "Action", "Mate", function() {entity.mate()});

//     // Idle
//     d2 = this.addNode(d1, "Sequence", "Wander");
//         this.addNode(d2, "Action", "Random", function() {entity.getLocation("Random")});
//         this.addNode(d2, "Action", "MoveTo", function() {entity.moveTo()});

//     // init
//     this.setActive(this.root);
// }