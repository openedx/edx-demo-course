Clazz.declarePackage ("org.jmol.modelset");
Clazz.load (["org.jmol.api.AtomIndexIterator"], "org.jmol.modelset.AtomIteratorWithinModel", ["org.jmol.atomdata.RadiusData"], function () {
c$ = Clazz.decorateAsClass (function () {
this.cubeIterator = null;
this.bspf = null;
this.threadSafe = false;
this.hemisphereOnly = false;
this.isZeroBased = false;
this.modelIndex = 2147483647;
this.atomIndex = -1;
this.zeroBase = 0;
this.distanceSquared = 0;
this.bsSelected = null;
this.isGreaterOnly = false;
this.checkGreater = false;
this.radiusData = null;
this.vdw1 = 0;
this.isVdw = false;
this.atoms = null;
this.viewer = null;
this.iNext = 0;
Clazz.instantialize (this, arguments);
}, org.jmol.modelset, "AtomIteratorWithinModel", null, org.jmol.api.AtomIndexIterator);
Clazz.makeConstructor (c$, 
function () {
});
Clazz.defineMethod (c$, "initialize", 
function (bspf, bsSelected, isGreaterOnly, isZeroBased, hemisphereOnly, threadSafe) {
this.bspf = bspf;
this.bsSelected = bsSelected;
this.isGreaterOnly = isGreaterOnly;
this.isZeroBased = isZeroBased;
this.hemisphereOnly = hemisphereOnly;
this.threadSafe = threadSafe;
this.cubeIterator = null;
}, "org.jmol.bspt.Bspf,org.jmol.util.BitSet,~B,~B,~B,~B");
Clazz.overrideMethod (c$, "setModel", 
function (modelSet, modelIndex, firstModelAtom, atomIndex, center, distance, rd) {
if (this.threadSafe) modelIndex = -1 - modelIndex;
if (modelIndex != this.modelIndex || this.cubeIterator == null) {
this.cubeIterator = this.bspf.getCubeIterator (modelIndex);
this.modelIndex = modelIndex;
}this.zeroBase = (this.isZeroBased ? firstModelAtom : 0);
if (distance == -2147483648) return;
this.atomIndex = (distance < 0 ? -1 : atomIndex);
this.isVdw = (rd != null);
if (this.isVdw) {
this.radiusData = rd;
this.atoms = modelSet.atoms;
this.viewer = modelSet.viewer;
distance = (rd.factorType === org.jmol.atomdata.RadiusData.EnumType.OFFSET ? 5 + rd.value : 5 * rd.value);
this.vdw1 = this.atoms[atomIndex].getVanderwaalsRadiusFloat (this.viewer, rd.vdwType);
}this.checkGreater = (this.isGreaterOnly && atomIndex != 2147483647);
this.setCenter (center, distance);
}, "org.jmol.modelset.ModelCollection,~N,~N,~N,org.jmol.util.Point3f,~N,org.jmol.atomdata.RadiusData");
Clazz.overrideMethod (c$, "setCenter", 
function (center, distance) {
if (this.cubeIterator == null) return;
this.cubeIterator.initialize (center, distance, this.hemisphereOnly);
this.distanceSquared = distance * distance;
}, "org.jmol.util.Point3f,~N");
Clazz.overrideMethod (c$, "hasNext", 
function () {
if (this.atomIndex >= 0) while (this.cubeIterator.hasMoreElements ()) {
var a = this.cubeIterator.nextElement ();
if ((this.iNext = a.index) != this.atomIndex && (!this.checkGreater || this.iNext > this.atomIndex) && (this.bsSelected == null || this.bsSelected.get (this.iNext))) {
return true;
}}
 else if (this.cubeIterator.hasMoreElements ()) {
var a = this.cubeIterator.nextElement ();
this.iNext = a.index;
return true;
}this.iNext = -1;
return false;
});
Clazz.overrideMethod (c$, "next", 
function () {
return this.iNext - this.zeroBase;
});
Clazz.overrideMethod (c$, "foundDistance2", 
function () {
return (this.cubeIterator == null ? -1 : this.cubeIterator.foundDistance2 ());
});
Clazz.overrideMethod (c$, "addAtoms", 
function (bsResult) {
var iAtom;
while (this.hasNext ()) if ((iAtom = this.next ()) >= 0) {
var d;
if (this.isVdw) {
d = this.atoms[iAtom].getVanderwaalsRadiusFloat (this.viewer, this.radiusData.vdwType) + this.vdw1;
switch (this.radiusData.factorType) {
case org.jmol.atomdata.RadiusData.EnumType.OFFSET:
d += this.radiusData.value * 2;
break;
case org.jmol.atomdata.RadiusData.EnumType.FACTOR:
d *= this.radiusData.value;
break;
}
d *= d;
} else {
d = this.distanceSquared;
}if (this.foundDistance2 () <= d) bsResult.set (iAtom);
}
}, "org.jmol.util.BitSet");
Clazz.overrideMethod (c$, "release", 
function () {
if (this.cubeIterator != null) {
this.cubeIterator.release ();
this.cubeIterator = null;
}});
});
