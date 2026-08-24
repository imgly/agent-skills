package ly.img.starterkit

import android.os.Bundle
import android.widget.Button
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.layout_launch_editor)
        findViewById<Button>(R.id.btn_launch_editor).setOnClickListener {
            // Launch editor activity here
            // val intent = Intent(this, EditorActivity::class.java)
            // startActivity(intent)
        }
    }
}
